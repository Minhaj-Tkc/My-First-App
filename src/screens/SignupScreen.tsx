import axios from 'axios';
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    Text,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from "../components/Input";
import Button from "../components/Button";
import { COLORS, FONTFAMILY } from "../theme/theme";
import { API_BASE_URL } from '../../config';

interface SignUpScreenProps {
    navigation: any;
}

const SignupScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [password1Error, setPassword1Error] = useState<string>('');
    const [password2Error, setPassword2Error] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const onSignUp = async () => {
        // Reset previous errors
        setUsernameError('');
        setFirstNameError('');
        setLastNameError('');
        setPassword1Error('');
        setPassword2Error('');

        // Validation checks
        let hasError = false;
        if (!username || username.length < 5) {
            setUsernameError('Username must be >= 5 characters');
            hasError = true;
        }
        if (!firstName) {
            setFirstNameError('First Name was not provided');
            hasError = true;
        }
        if (!lastName) {
            setLastNameError('Last Name was not provided');
            hasError = true;
        }
        if (!password1 || password1.length < 8) {
            setPassword1Error('Password is too short');
            hasError = true;
        }
        if (password1 !== password2) {
            setPassword2Error("Passwords don't match");
            hasError = true;
        }

        // Stop if validation failed
        if (hasError) {
            return;
        }

        // Create the user object to send
        const user = {
            username,
            first_name: firstName,
            last_name: lastName,
            password: password1,
        };

        setLoading(true);

        try {
            // Make the POST request
            const response = await axios.post(`${API_BASE_URL}/users/create/`, user);

            // Handle the response accordingly
            if (response.status === 201) {
                console.log('User created successfully:', response.data);

                const token = response.data.token;
                const userId = response.data.id; // Adjusted to match the response structure

                if (token && userId) {
                    // Save token and userId and navigate to Tab screen
                    await AsyncStorage.setItem('userToken', token);
                    await AsyncStorage.setItem('userId', userId.toString());
                    navigation.navigate('Tab');
                } else {
                    Alert.alert('Signup Successful', 'Please log in.');
                    navigation.navigate('Login');
                }
            } else {
                console.log('Error creating user:', response.data);
            }
        } catch (error: unknown) {
            console.error('Error signing up:', error);

            // Assert error type
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                console.log('Error response data:', data);
                if (data.username) setUsernameError(data.username[0]);
                if (data.first_name) setFirstNameError(data.first_name[0]);
                if (data.last_name) setLastNameError(data.last_name[0]);
                if (data.password) setPassword1Error(data.password[0]);
            } else {
                Alert.alert('Signup Failed', 'An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />
            <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Sign Up</Text>
                        <Input
                            title='Username'
                            value={username}
                            error={usernameError}
                            setValue={setUsername}
                            setError={setUsernameError}
                        />
                        <Input
                            title='First Name'
                            value={firstName}
                            error={firstNameError}
                            setValue={setFirstName}
                            setError={setFirstNameError}
                        />
                        <Input
                            title='Last Name'
                            value={lastName}
                            error={lastNameError}
                            setValue={setLastName}
                            setError={setLastNameError}
                        />
                        <Input
                            title='Password'
                            value={password1}
                            error={password1Error}
                            setValue={setPassword1}
                            setError={setPassword1Error}
                            secureTextEntry={true}
                        />
                        <Input
                            title='Retype Password'
                            value={password2}
                            error={password2Error}
                            setValue={setPassword2}
                            setError={setPassword2Error}
                            secureTextEntry={true}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color={COLORS.primaryBlackHex} />
                        ) : (
                            <Button title='Sign Up' onPress={onSignUp} />
                        )}
                        <Text style={styles.signInText}>
                            Already have an account?
                            <Text
                                style={styles.signInLink}
                                onPress={() => navigation.goBack()}
                            >
                                Sign In
                            </Text>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 36,
        fontFamily: FONTFAMILY.poppins_bold,
        color: COLORS.secondaryDarkGreyHex,
    },
    signInText: {
        textAlign: 'center',
        marginTop: 40,
    },
    signInLink: {
        color: 'blue',
    },
});

export default SignupScreen;
