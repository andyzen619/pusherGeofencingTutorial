/* pages/index.js */

import React, { Component, Fragment } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import Layout from "../componenets/Layout";
import ChoosePersona from "../componenets/ChoosePersona";
import Map from "../componenets/Map";
import NearbyFriends from "../componenets/NearbyFriends";

class IndexPage extends Component {
  state = { id: null, people: [], currentLocation: {} };

  regionFiltered = people => this.nearby.updatePeople(people);

  /**
   * Ends pusher connection and and sends a /offline req to server for the current user
   */
  endConnection = () => {
    this.pusher.disconnect();
    axios.post(`/offline/${this.state.id}`);
  };

  /**
   * *Life cycle method
   * Sets up subscription to pusher map-geofencing channel
   */
  componentWillMount() {
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true
    });

    this.channel = this.pusher.subscribe("map-geofencing");
  }

  /**
   * *Life cycle methode
   * Makes req to people route and set the state
   */
  componentDidMount() {
    axios.get("/people").then(({ data }) => {
      const { people = [] } = data;
      this.setState({ people });
    });

    window.onbeforeunload = this.endConnection;
  }

  componentWillUnmount() {
    this.endConnection();
  }

  updateLocation = (position, id) => {
    let currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    let newPeople = this.state.people;
    newPeople.forEach(person => {
      if(person.id === id) {
        person.position = currentPosition;
      }
    })
    console.log(newPeople);

    this.setState(prevState => ({
      ...prevState,
      currentLocation: currentPosition
    }));
    // axios.post(`/updateLocation/${id}`, location);
  }

  getLivePosition = () =>{
    navigator.geolocation.getCurrentPosition(position => {
      this.updateLocation(position, this.state.id);
    });
  }

  /**
   * Sends online and current location request to activate user :id
   */
  personaSelected = (id) => {
    this.setState({ id });
    axios.post(`/online/${id}`);
  };

  render() {
    const { id, people } = this.state;
    const person = people.find(person => person.id === id) || {};
    const peopleOffline = people.filter(person => !person.online);

    return (
      <Layout pageTitle="Realtime Geofencing">
        <main className="container-fluid position-absolute h-100 bg-light">
          {id ? (
            <div className="row position-absolute w-100 h-100">
              <section className="col-md-9 px-0 border-right border-gray position-relative h-100">
                <Map
                  person={person}
                  radius={1000}
                  people={people}
                  channel={this.channel}
                  onRegionFiltered={this.regionFiltered}
                />
              </section>

              <section className="col-md-3 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
                <NearbyFriends
                  ref={elem => (this.nearby = elem)}
                  person={person}
                />
              </section>
            </div>
          ) : (
            <ChoosePersona
              count={5}
              people={peopleOffline}
              onSelected={this.personaSelected}
              getLivePosition={this.getLivePosition}
            />
          )}
        </main>
      </Layout>
    );
  }
}

export default () => <IndexPage />;
