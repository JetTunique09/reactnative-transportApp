import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
      <Image
        source={require('@/assets/images/contact.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Contact</ThemedText>
      </ThemedView>
      <ThemedText>Listes des membres d'équipe et personne à contacter : </ThemedText>
      <Collapsible title="Responsables d'intervention">
        <ThemedText>
          Niveau 1 : John Doe - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.09.30.38.40</ThemedText>
        </ThemedText>
        <ThemedText>
          Niveau 2 : Tess Feuch - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.12.03.30.67</ThemedText>
        </ThemedText>
        <ThemedText>
          Niveau 3 : No Rosen - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">07.49.03.33.00</ThemedText>
        </ThemedText>
        <ThemedText>
          Pour rappel, joindre le responsable de <ThemedText type="defaultSemiBold">Niveau 3</ThemedText>{' '}
          uniquement pour les <ThemedText type="defaultSemiBold">urgences</ThemedText>.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link"></ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Equipe Réseau">
        <ThemedText>
          - Jacques Miller - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.09.30.38.40</ThemedText>
        </ThemedText>
        <ThemedText>
          - Jim Hoper - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.12.03.30.67</ThemedText>
        </ThemedText>
        <ThemedText>
          - Mike Anigan - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">07.49.03.33.00</ThemedText>
        </ThemedText>
        <ThemedText>
          Responsable Réseau : M.Brown  {' '}<ThemedText style={styles.blueText} type="defaultSemiBold">06.90.34.12.33</ThemedText>
        </ThemedText>
      </Collapsible>
      <Collapsible title="Support Technique">
        <ThemedText>
          Responsable Technique : Luc Martin - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.72.19.84.12</ThemedText>
        </ThemedText>
        <ThemedText>
          Technicien Réseau : Sophie Duval - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">07.15.23.45.67</ThemedText>
        </ThemedText>
        <ThemedText>
          Support : Nicolas Dupuis - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.45.89.12.33</ThemedText>
        </ThemedText>
      </Collapsible>
      <Collapsible title="Equipe Communication">
        <ThemedText>
          Responsable Com. : Julie Bernard - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.21.43.55.78</ThemedText>
        </ThemedText>
        <ThemedText>
          Chargé de Projet : Maxime Leroy - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">07.09.12.34.56</ThemedText>
        </ThemedText>
        <ThemedText>
          Graphiste : Elise Morel - {' '}
          <ThemedText style={styles.blueText} type="defaultSemiBold">06.88.99.00.44</ThemedText>
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mapImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  blueText: {
    color: 'blue', 
  },
});
