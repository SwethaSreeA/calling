import React from "react";
import {Text,View,SafeAreaView,FlatList,TouchableHighlight} from 'react-native';
import { Avatar,ListItem,Divider} from "react-native-elements";
import {CometChat} from '@cometchat-pro/react-native-chat';
import { TouchableOpacity } from "react-native-gesture-handler";


export default class Call extends React.Component{

    constructor(){
        super();
        this.state={
            callSettings:'',
            user:''
        }
    }

    componentDidMount(){
        this.getUser();
        this.getCallListener();
    }

    getUser=()=>{
        CometChat.getLoggedinUser().then(
            user => {
                this.setState({user:user})
            })
    }

 getCallListener=()=>{
                     /**
                    * You can get the call Object from the success of acceptCall() or from the onOutgoingCallAccepted() callback of the CallListener.
                    */
            
            var sessionId = this.props.route.params.call.sessionId;
            var callType = this.props.route.params.call.type;
            let callListener = new CometChat.OngoingCallListener({
                onUserJoined: user => {
                    console.log('User joined call:', user);
                },
                onUserLeft: user => {
                    console.log('User left call:', user);
                    //this.props.navigation.navigate("OnetoOneConversationScreen",{item:call.receiver===this.state.user?call.sender:call.receiver});
                },
                onUserListUpdated: userList => {
                        console.log("user list:", userList);
                },
                onAudioModesUpdated: (audioModes) => {
                    console.log("audio modes:", audioModes);
                },
                onCallEnded: call => {
                    console.log('Call ended listener', call);
                    this.props.navigation.navigate("OnetoOneConversationScreen",{item:call.receiver===this.state.user?call.sender:call.receiver});
                },
                onError: error => {
                    console.log('Call Error: ', error);
                   // this.props.navigation.navigate("OnetoOneConversationScreen",{item:call.receiver===this.state.user?call.sender:call.receiver});
                },
            });
            var callSettings = new CometChat.CallSettingsBuilder()
                                                .setSessionID(sessionId)
                                                .enableDefaultLayout(true)
                                                .setIsAudioOnlyCall(callType == 'aduio' ? true : false)
                                                .setCallEventListener(callListener)
                                                .build();
        console.log(callSettings)
        this.setState({callSettings:callSettings});
    }


    render(){
        console.log("in call screen")
        if(!this.state.callSettings){
            return (null)
        }
            return(
                <View style={{height: '100%', width: '100%', position: 'relative'}}>
                    <CometChat.CallingComponent callsettings= {this.state.callSettings} />
                </View>
            );
        
    }
}