import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, FlatList, TouchableOpacity, View, Modal, TextInput, Button, Text, ScrollView, Alert, ActionSheetIOS, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Camera, useCameraPermissions } from 'expo-camera';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Obstacle = {
  id: number;
  title: string;
  description: string;
  photos?: string[]; // Array of photo URIs
};

const STORAGE_KEY = '@obstacles';

export default function HomeScreen() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedObstacle, setSelectedObstacle] = useState<Obstacle | null>(null);
  const [newObstacle, setNewObstacle] = useState({ title: '', description: '' });
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Fonction pour charger les obstacles depuis AsyncStorage
  const loadObstacles = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      setObstacles(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      console.error(e);
    }
  };

  // Fonction pour supprimer un obstacle
  const removeObstacle = async (id: number) => {
    const updatedObstacles = obstacles.filter((obstacle) => obstacle.id !== id);
    setObstacles(updatedObstacles);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObstacles));
  };

  // Fonction pour ajouter un nouvel obstacle
  const addObstacle = async () => {
    const newId = obstacles.length > 0 ? obstacles[obstacles.length - 1].id + 1 : 1;
    const updatedObstacles = [...obstacles, { ...newObstacle, id: newId, photos: [] }];
    setObstacles(updatedObstacles);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObstacles));
    setModalVisible(false);
    setNewObstacle({ title: '', description: '' });
  };

  // Fonction pour éditer un obstacle existant
  const editObstacle = async () => {
    if (selectedObstacle) {
      const updatedObstacles = obstacles.map((obstacle) =>
        obstacle.id === selectedObstacle.id
          ? { ...obstacle, title: newObstacle.title, description: newObstacle.description }
          : obstacle
      );
      setObstacles(updatedObstacles);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObstacles));
      setModalVisible(false);
      setEditMode(false);
      setSelectedObstacle(null);
      setNewObstacle({ title: '', description: '' });
    }
  };

  // Fonction pour ouvrir la modale d'édition
  const openEditModal = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setNewObstacle({ title: obstacle.title, description: obstacle.description });
    setEditMode(true);
    setModalVisible(true);
  };

  // Fonction pour ouvrir le modal d'ajout d'un obstacle
const openAddModal = () => {
  setNewObstacle({ title: '', description: '' }); // Réinitialise le nouvel obstacle
  setEditMode(false); // Assure qu'on n'est pas en mode édition
  setSelectedObstacle(null); // Aucun obstacle sélectionné
  setModalVisible(true); // Ouvre le modal
};

// Fonction pour fermer le modal et réinitialiser les états
const closeModal = () => {
  setModalVisible(false);
  setEditMode(false); // Sort du mode édition
  setSelectedObstacle(null); // Aucun obstacle sélectionné
  setNewObstacle({ title: '', description: '' }); // Réinitialise le formulaire
};

// Fonction pour annuler la modification ou l'ajout
const handleCancel = () => {
  closeModal(); // Ferme et réinitialise le modal
};

  // Fonction pour prendre une photo et l'ajouter à l'obstacle sélectionné
  const takePhoto = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const { status } = await requestCameraPermission();
      if (status !== 'granted') {
        console.log('Permission de la caméra refusée');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && selectedObstacle) {
      const updatedPhotos = [...(selectedObstacle.photos || []), result.assets[0].uri];
      updateObstaclePhotos(updatedPhotos);
    }
  };

  // Fonction pour choisir une photo depuis la galerie et l'ajouter à l'obstacle sélectionné
  const chooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && selectedObstacle) {
      const updatedPhotos = [...(selectedObstacle.photos || []), result.assets[0].uri];
      updateObstaclePhotos(updatedPhotos);
    }
  };

  // Fonction pour mettre à jour les photos d'un obstacle sélectionné
  const updateObstaclePhotos = async (updatedPhotos: string[]) => {
    if (selectedObstacle) {
      const updatedObstacles = obstacles.map((obstacle) =>
        obstacle.id === selectedObstacle.id ? { ...obstacle, photos: updatedPhotos } : obstacle
      );
      setObstacles(updatedObstacles);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObstacles));
      setSelectedObstacle({ ...selectedObstacle, photos: updatedPhotos });
    }
  };

  // Fonction pour afficher un menu avec les options pour ajouter des photos
  const showPhotoOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Prendre une photo', 'Choisir dans la galerie', 'Annuler'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            takePhoto();
          } else if (buttonIndex === 1) {
            chooseFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Ajouter une photo',
        'Choisissez une option',
        [
          { text: 'Prendre une photo', onPress: takePhoto },
          { text: 'Choisir dans la galerie', onPress: chooseFromGallery },
          { text: 'Annuler', style: 'cancel' },
        ]
      );
    }
  };

  // Fonction pour ouvrir la modale des photos d'un obstacle
  const openPhotoModal = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setPhotoModalVisible(true);
  };

  // Fonction pour supprimer une photo spécifique
  const removePhoto = async (photoUri: string) => {
    if (selectedObstacle) {
      const updatedPhotos = selectedObstacle.photos?.filter((photo) => photo !== photoUri);
      const updatedObstacles = obstacles.map((obstacle) =>
        obstacle.id === selectedObstacle.id ? { ...obstacle, photos: updatedPhotos } : obstacle
      );
      setObstacles(updatedObstacles);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedObstacles));
      setSelectedObstacle({ ...selectedObstacle, photos: updatedPhotos });
    }
  };

  // Chargement des obstacles à l'initialisation
  useEffect(() => {
    loadObstacles();
  }, []);

  const renderObstacle = ({ item }: { item: Obstacle }) => (
    <ThemedView style={styles.obstacleContainer}>
      <ThemedText type="title">{item.title}</ThemedText>
      <ThemedText>{item.description}</ThemedText>
      {item.photos && item.photos.length > 0 && (
        <ScrollView horizontal>
          {item.photos.map((photoUri, index) => (
            <Image key={index} source={{ uri: photoUri }} style={styles.obstacleImage} />
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => removeObstacle(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
          <Ionicons name="pencil-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openPhotoModal(item)} style={styles.photoButton}>
          <Ionicons name="image-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('../../assets/images/map.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Obstacles</ThemedText>
        </ThemedView>
        <FlatList
          data={obstacles}
          renderItem={renderObstacle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </ParallaxScrollView>

      {/* Bouton d'ajout d'obstacle */}
      <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
      <Ionicons name="add-outline" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modale pour ajouter ou modifier un obstacle */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              {editMode ? 'Modifier un obstacle' : 'Ajouter un nouvel obstacle'}
            </ThemedText>
            <TextInput
              value={newObstacle.title}
              onChangeText={(text) => setNewObstacle({ ...newObstacle, title: text })}
              placeholder="Titre"
              placeholderTextColor="#555"
              style={styles.input}
            />
            <TextInput
              value={newObstacle.description}
              onChangeText={(text) => setNewObstacle({ ...newObstacle, description: text })}
              placeholder="Description"
              placeholderTextColor="#555"
              style={styles.input}
            />
            
            {/* Bouton Ajouter Photo */}
            <TouchableOpacity onPress={showPhotoOptions} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Ajouter Photo</Text>
            </TouchableOpacity>

            {/* Bouton Enregistrer ou Ajouter */}
            <TouchableOpacity onPress={editMode ? editObstacle : addObstacle} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                {editMode ? 'Enregistrer' : 'Ajouter'}
              </Text>
            </TouchableOpacity>

            {/* Bouton Annuler */}
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.modalButton, { backgroundColor: 'red' }]}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modale pour afficher et ajouter des photos à un obstacle */}
      <Modal
        visible={photoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPhotoModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.photoModalContent}>
            <ThemedText type="title" style={styles.modalTitle}>Photos de l'obstacle</ThemedText>
            <ScrollView horizontal>
              {selectedObstacle?.photos?.map((photoUri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photoUri }} style={styles.photoImage} />
                  <TouchableOpacity onPress={() => removePhoto(photoUri)} style={styles.removePhotoButton}>
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={showPhotoOptions} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Ajouter Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPhotoModalVisible(false)} style={[styles.modalButton, { backgroundColor: 'red' }]}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  listContainer: {
    padding: 16,
  },
  obstacleContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  obstacleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ff4d4d', // Couleur de fond rouge pour supprimer
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007AFF', // Couleur de fond bleue pour éditer
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  photoButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'green', // Couleur de fond bleue pour ajouter photo
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007AFF', // Couleur de fond bleue pour le bouton d'ajout
    borderRadius: 50,
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: '#f0f0f0', // Couleur de fond gris clair pour le contenu modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  photoModalContent: {
    backgroundColor: '#f0f0f0', // Couleur de fond gris clair pour le contenu modal de photo
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: 'black', // Couleur du texte en noir
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: '#007AFF', // Couleur de fond bleue pour le bouton modal
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff', // Couleur du texte en blanc pour le bouton modal
    fontSize: 16,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  photoContainer: {
    position: 'relative',
    marginHorizontal: 5,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 4,
  },
});

