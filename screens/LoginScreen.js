import * as React from 'react';
import {View,Text,SafeAreaView,StyleSheet,StatusBar,TouchableOpacity} from 'react-native';
import { Header,Input} from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";
import AppHeader from '../components/AppHeader';
import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginScreen extends React.Component{

    constructor(){
        super();
        this.state={
            uuid:''
        }
    }

    componentDidMount(){
         CometChat.getLoggedinUser().then(
            user => {  
                if(user){
                    this.props.navigation.navigate('MainScreen',{user:user});
                }
            }).catch((error)=>{console.log(error)})
    }

    logIn= async (uuid)=>{
        try{
            var UID = uuid;
        console.log(uuid);
        console.log(this.state.uuid);
        //await AsyncStorage.clear();
        var authKey = "63f233e82a56cc60be7887636553645c4d48c9ab";
                CometChat.login(this.state.uuid, authKey).then(
                user => {
                console.log("Login Successful:", { user });
                this.props.navigation.navigate('MainScreen',{user:user});
                }, error => {
                console.log("Creating user")
                var user = new CometChat.User(uuid);
                user.setName(uuid);
                CometChat.createUser(user, authKey).then(
                user => {
                            console.log("user created", user);
                            this.props.navigation.navigate('MainScreen',{user:user});
                }, error => {
                            console.log("error", error);
                        }
                )
                
                }
            );
        }
        catch(error){
            console.log(error);
        }
        
    }

    render(){
        return(
        <SafeAreaView >
            <StatusBar backgroundColor={"#17403B"}/>
            <Header
                backgroundColor="#015C52"
                containerStyle={{ width: 450,height:80 }}
                leftComponent={{
                    text: "WhatsApp",
                    style: {
                    color: "#ffff",
                    fontWeight: "bold",
                    fontSize: 18,
                    
                    }
                }}
                placement="center"
            />
            <Input
                disabledInputStyle={{ background: "#ddd" }}
                label="Welcome"
                leftIcon={<Icon name="person" size={20} />}
                placeholder="Enter Name"
                onChangeText={(text)=>{
                    this.setState({uuid:text})
                }}
            />
            <TouchableOpacity style={styles.logInButton} 
            onPress={()=>{
                console.log("Log In pressed");
                this.logIn(this.state.uuid);
            }}>
                <Text style={styles.buttonText}>
                    Submit
                </Text>
            </TouchableOpacity>
    
        </SafeAreaView>)
    }
}

const styles=StyleSheet.create({
    logInButton:{
        backgroundColor:'#015C52',
        borderRadius:30,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30,
        width:200,
        height:50
    },
    buttonText:{
        color:'white',
        fontWeight:'bold'
    }
})