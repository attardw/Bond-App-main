import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'

function Events({ location }) {
  // Save states for events, loading, and category filter
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    resetFilterAndReloadEvents();
  }, [location]); // Reload events whenever location changes

  // Function to fetch events using TicketMaster API
  const fetchEvents = async () => {
    if (!location) return;  // Without location, do nothing
    setLoading(true);       // Set loading while fetching events

    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=ibU8LQiGf8IZEAGJU7gAOopILKM31Gql&latlong=${location.latitude},${location.longitude}&radius=20`
      );
      const data = await response.json();
      setEvents(data._embedded ? data._embedded.events : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events. Please try again later.');
      setLoading(false);
    }
  };

  // Function to reset filter state and reload events
  const resetFilterAndReloadEvents = () => {
    setCategoryFilter('all');
    fetchEvents();
  };

  // Filter events by category (called classification in the API)
  const filterByCategory = (classification) => {
    if (classification === 'all') {
      return events;
    } else {
      return events.filter(event => event.classifications.find(c => c.segment.name.toLowerCase() === classification));
    }
  };

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value);
  };

  let filteredEvents = filterByCategory(categoryFilter);

  // If loading, print loading message
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading events...</Text>
      </View>
    );
  }

  // If length of array of events is 0, no events were found
  if (filteredEvents.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No events found :(</Text>
      </View>
    );
  }

  // Show filter menu and display events
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <Text style={{ marginRight: 10 }}>Filter by:</Text>
        <Picker
          selectedValue={categoryFilter}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue) => handleCategoryFilterChange(itemValue)}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Music" value="music" />
          <Picker.Item label="Sports" value="sports" />
          <Picker.Item label="Arts" value="arts" />
          <Picker.Item label="Family" value="family" />
        </Picker>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredEvents.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <Image
              source={{ uri: event.images[0].url }}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventDetails}>{event.dates.start.localDate}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  eventDetails: {
    fontSize: 16,
    color: 'gray',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 50
  },
});

export default Events;