import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, Alert, CheckBox } from 'react-native';
import styles from './styles';
import RoundedButton from '../../components/RoundedButton';
import { useAuth } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import { Container } from './styles';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);

  const { signIn } = useAuth();

  const getEmail = (typed) => {
    setEmail(typed);
  }
  const getSenha = (typed) => {
    setSenha(typed);
  }
  const logInHandle = () => {
    
    if(email === 'teste' && senha === '123456') {
      signIn(email, senha);
    }
    else { 
      return (
        Alert.alert(
          'Error',
          'Login Invalido!',
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        )
      )
    }
  }

  const navigateToRegistrationType = () => {
    navigation.navigate('RegistrationType');
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/FindLogoBlack.png')}
        />
      </View>
      <View style={styles.inputsContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput 
            placeholder="Digite seu e-mail" 
            placeholderTextColor={'#888888'}
            style={styles.TextInput}
            onChangeText={getEmail}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput 
            placeholder="Digite sua senha" 
            placeholderTextColor={'#888888'}
            secureTextEntry={true}
            style={styles.TextInput}
            onChangeText={getSenha}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <RoundedButton 
            text="Entrar" 
            onPress={() => {logInHandle()}} 
            selected={true} 
            width={328}
            height={51}
        />
        <View style={styles.registerTextContainer}>
          <Text style={styles.text}>
            {"Nao tem uma conta? "}
          </Text>
            <TouchableOpacity
              onPress={navigateToRegistrationType}
            >
              <Text style={styles.registerText}>Cadastre-se já!</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Login;