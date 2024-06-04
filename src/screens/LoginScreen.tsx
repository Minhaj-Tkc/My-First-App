import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    StatusBar
} from "react-native";
import axios from "axios";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { COLORS, FONTFAMILY } from "../theme/theme";
import { API_BASE_URL } from "../../config";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    // Function to handle login
    const onSignIn = async () => {
        // Reset previous errors
        setUsernameError('');
        setPasswordError('');

        // Validation checks
        const failUsername = !username;
        if (failUsername) {
            setUsernameError('Username not provided');
        }
        const failPassword = !password;
        if (failPassword) {
            setPasswordError('Password not provided');
        }
        if (failUsername || failPassword) {
            console.log('Validation failed', { failUsername, failPassword });
            return;
        }

        // Log validation success
        console.log('Validation passed:', { username, password });

        // Create the user object to send
        const user = {
            username,
            password,
        };

        try {
            // Make the POST request
             
            const response = await axios.post(`${API_BASE_URL}/users/login/`, user);
            
            // Handle the response accordingly
            if (response.status === 200) {
                console.log('User logged in successfully:', response.data);
                navigation.navigate('Tab');
            } else {
                console.log('Error logging in:', response.data);
            }
        } catch (error: unknown) {
            console.error('Error logging in:', error);

            // Assert error type
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                console.log('Error response data:', data);
                if (data.non_field_errors) {
                    setUsernameError(data.non_field_errors[0]);
                    setPasswordError(data.non_field_errors[0]);
                } else {
                    if (data.username) setUsernameError(data.username[0]);
                    if (data.password) setPasswordError(data.password[0]);
                }
            } else {
                setUsernameError('An unknown error occurred. Please try again.');
            }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />
            <KeyboardAvoidingView behavior="height" style={styles.keyboardAvoidingContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Title text='The Coffee Shop' color='#202020' />

                        <Input
                            title='Username'
                            value={username}
                            error={usernameError}
                            setValue={setUsername}
                            setError={setUsernameError}
                        />

                        <Input
                            title='Password'
                            value={password}
                            error={passwordError}
                            setValue={setPassword}
                            setError={setPasswordError}
                            secureTextEntry={true}
                        />

                        <Button
                            title='Sign In'
                            onPress={onSignIn}
                        />

                        <Text style={styles.signUpText}>
                            Don't have an account? <Text
                                style={styles.signUpLink}
                                onPress={() => navigation.navigate('Signup')}
                            >
                                Sign Up
                            </Text>
                        </Text>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

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
        paddingHorizontal: 20,
    },
    signUpText: {
        textAlign: 'center',
        marginTop: 40,
    },
    signUpLink: {
        color: 'blue',
    },
});

export default LoginScreen;
