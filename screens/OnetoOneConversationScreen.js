import React from "react";
import {Text,View,SafeAreaView,StyleSheet,FlatList,KeyboardAvoidingView,TouchableHighlight,Pressable,TouchableOpacity,Modal,TextInput, Alert} from 'react-native';
import { Avatar,ListItem} from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import {CometChat} from '@cometchat-pro/react-native-chat';
import  * as ImagePicker from 'react-native-image-picker';
import { ScrollView } from "react-native-gesture-handler";

export default class OnetoOneConversation extends React.Component{

    constructor(props){
        super(props);
        this.state={
            messageText:'',
            name:'',
            avatar:'',
            uid:this.props.route.params.item.uid,
            messages:[],
            user:'',
            incomingModalVisible: false,
            outgoingModalVisible: false,
            call:''
        }
    }
   
    componentDidMount(){
        this.invokeCallListener();
        this.invokeMessageListener();
        this.fetchMessages();
         CometChat.getLoggedinUser().then(
            user => {
                this.setState({user:user})
            })
    }

    updateMessages=(message)=>{
        this.setState({messages:[...this.state.messages,message]})
    }

    invokeMessageListener=()=>{
        let listenerID = this.props.route.params.item.uid+"_LISTENER_ID";

        CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
            onTextMessageReceived: textMessage => {
                console.log("Text message received successfully", textMessage);
                this.updateMessages(textMessage)
            },
            onMediaMessageReceived: mediaMessage => {
                console.log("Media message received successfully", mediaMessage);
                this.updateMessages(mediaMessage)            },
            onCustomMessageReceived: customMessage => {
                console.log("Custom message received successfully", customMessage);
                this.updateMessages(customMessage)
            }
        })
        );
    }

    fetchMessages=()=>{
        let UID = this.props.route.params.item.uid;
        let limit = 30;

        let messagesRequest = new CometChat.MessagesRequestBuilder()
                                                        .setUID(UID)
                                                        .setLimit(limit)
                                                        .build();

        messagesRequest.fetchPrevious().then(
        messages => {
            console.log("Message list fetched:", messages);
            this.setState({messages:messages})
            console.log(this.state.messages)
        }, error => {
            console.log("Message fetching failed with error:", error);
        }
        );
    }

    fetchMoreMessages=async ()=>{
        let UID = this.props.route.params.item.uid;
        let limit = 30;
        let latestId = await CometChat.getLastDeliveredMessageId();

        var messagesRequest = new CometChat.MessagesRequestBuilder()
                                                        .setUID(UID)
                                                        .setMessageId(latestId)
                                                        .setLimit(limit)
                                                        .build();

        messagesRequest.fetchNext().then(
        messages => {
            console.log("Message list fetched:", messages);
            this.updateMessages(messages);
             }, error => {
            console.log("Message fetching failed with error:", error);
        }
);
    }

    componentWillUnmount(){
        var listenerID = this.state.uid+"_LISTENER_ID";
        CometChat.removeCallListener(listenerID);
    }

    invokeCallListener=()=>{
        var listnerID = this.state.uid+"_LISTENER_ID";
        CometChat.addCallListener(
        listnerID,
        new CometChat.CallListener({
            onIncomingCallReceived: (call) => {
            console.log("Incoming call:", call);
            // Handle incoming call
            this.setState({incomingModalVisible:true,call:call})
            },
            onOutgoingCallAccepted: (call) => {
            console.log("Outgoing call accepted:", call);
            // Outgoing Call Accepted
            this.setState({outgoingModalVisible:false,call:call});
            this.acceptCall();
            },
            onOutgoingCallRejected: (call) => {
            console.log("Outgoing call rejected:", call);
            // Outgoing Call Rejected
            this.setState({outgoingModalVisible:false});
            Alert.alert("The user is busy");
            },
            onIncomingCallCancelled: (call) => {
            console.log("Incoming call calcelled:", call);
            this.setState({incomingModalVisible:false})
            Alert.alert("The call was cancelled");
            }
        })
        );
    }

    acceptCall=()=>{
        var sessionID = this.state.call.sessionId;
        console.log("in accept call");
        console.log(this.state.call)
        CometChat.acceptCall(sessionID).then(
        call => {
            console.log("Call accepted successfully:", call);
            // start the call using the startCall() method
            this.setState({incomingModalVisible:false})
            this.props.navigation.navigate('CallScreen',{call:call})
            
        },
        error => {
            console.log("Call acceptance failed with error", error);
            // handle exception
        }
        );
    }

    rejectCall=(action)=>{
        var sessionID = this.state.call.sessionID;
        var status = action=="REJECT"?CometChat.CALL_STATUS.REJECTED:CometChat.CALL_STATUS.CANCELLED;

        CometChat.rejectCall(sessionID, status).then(
        call => {
            console.log("Call rejected successfully", call);
            this.setState({outgoingModalVisible:false,incomingModalVisible:'false'})
        },
        error => {
            console.log("Call rejection failed with error:", error);
        }
        );
    }

    
    sendTextMessage=()=>{
        
        let receiverID = this.props.route.params.item.uid;
        let messageText = this.state.messageText;
        let receiverType = CometChat.RECEIVER_TYPE.USER;
        let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

        CometChat.sendMessage(textMessage).then(
        message => {
            console.log("Message sent successfully:", message);
            this.setState({messageText:''})
            this.updateMessages(message);
        }, error => {
            console.log("Message sending failed with error:", error);
        }
        );
    }

    sendMediaMessage=()=>{

        let options={};
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled photo picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              console.log('ImagePicker Response: ', response);
              if (Platform.OS === 'ios' && response.fileName != undefined) {
                var ext = response.fileName.split('.')[1].toLowerCase();
                var type = this.getMimeType(ext);
                var name = response.fileName;
              } else {
                var type = response.type;
                var name = 'Camera_001.jpeg';
              }
              var file = {
                name: Platform.OS === "android" ? response.fileName : name,
                type: Platform.OS === "android" ? response.type : type,
                uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
              }
              console.log('file: ', file);
              this.setState({ mediaMsg: file })
            }
          });

            let receiverID = this.props.route.params.item.uid;
            let messageType = CometChat.MESSAGE_TYPE.FILE;
            let receiverType = CometChat.RECEIVER_TYPE.USER;
            let mediaMessage = new CometChat.MediaMessage(receiverID, this.state.mediaMsg, messageType, receiverType);

            CometChat.sendMediaMessage(mediaMessage).then(
            message => {
                console.log("Media message sent successfully", message);
                this.updateMessages(message);
            }, error => {
                console.log("Media message sending failed with error", error);
            }
            );
    }
    
    sendMessageLink=()=>{
        let receiverID = this.props.route.params.item.uid;
        let messageType = CometChat.MESSAGE_TYPE.IMAGE;
        let receiverType = CometChat.RECEIVER_TYPE.USER;
        let mediaMessage = new CometChat.MediaMessage(receiverID, "", messageType, receiverType);

        let file = {
        name: "mario",
        extension: "png",
        mimeType: "image/png",
        url: "https://pngimg.com/uploads/mario/mario_PNG125.png"
        };

        let attachment = new CometChat.Attachment(file);

        mediaMessage.setAttachment(attachment);

        CometChat.sendMediaMessage(mediaMessage).then(
            mediaMessage => {
                console.log("message", mediaMessage)
                this.updateMessages(message);
            }, error => {
                console.log("error in sending message", error)
            }
        );
    }

    makeAudioCall=(type)=>{
        var receiverID = this.props.route.params.item.uid;
        var callType = type==="AUDIO"?CometChat.CALL_TYPE.AUDIO:CometChat.CALL_TYPE.VIDEO;
        var receiverType = CometChat.RECEIVER_TYPE.USER;

        var call = new CometChat.Call(receiverID, callType, receiverType);

        CometChat.initiateCall(call).then(
        outGoingCall => {
            console.log("Call initiated successfully:", outGoingCall);
            // perform action on success. Like show your calling screen.
            this.setState({outgoingModalVisible:true,call:call});
        },
        error => {
            console.log("Call initialization failed with exception:", error);
        }
        );
    }

    renderItem=({item})=>{
      
            let name="";
            let content= (item.type!=="video")?((item.text?item.text:"image url")):("Video call "+item.status);
            if(item.receiverId!==this.state.user.uid){
                    name=this.state.user.name; 
            } else {
                    name=this.props.route.params.item.name;
            }
                return(
                    <View>
                    <ListItem
                        Component={TouchableHighlight}
                        containerStyle={{}}
                        disabledStyle={{ opacity: 0.5 }}
                        onLongPress={() => console.log("onLongPress()")}
                    >  
                    <ListItem.Content>
                        <ListItem.Title>
                        <Text>{name}</Text>
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {content}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    </ListItem>
                    
                    </View>
                )
    }


    render(){
      let receiver=this.props.route.params.item;
      const { modalVisible } = this.state;
      console.log(this.state.messages.length);
            return(
                    <View>   
                    <SafeAreaView> 
                    <ScrollView>
                    <View style={{flex:0.2,backgroundColor:'#17403B',flexDirection:'row',marginTop:22}}>
                    <Avatar
                        activeOpacity={0.2}
                        containerStyle={{ backgroundColor: "#BDBDBD" }}
                        rounded
                        size="medium"
                        source={{ uri: receiver.avatar}}
                    />
                    <Text style={{color:'white',fontWeight:'bold',fontSize:16,marginTop:20,marginLeft:20}}>{receiver.name}</Text>
                    <TouchableOpacity onPress={()=>{this.makeAudioCall("AUDIO")}} style={{marginLeft:130,justifyContent:'center'}}>
                                <Icon name="call-sharp" size={30} color={'white'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.makeAudioCall("VIDEO")}} style={{marginLeft:20,justifyContent:'center'}}>
                                <Icon name="videocam" size={30} color={'white'}/>
                    </TouchableOpacity>
                    </View>
                    
                <View style={styles.centeredView}>
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.incomingModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setState({incomingModalVisible:false});
                    }}
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>Call with {receiver.name}</Text>
                        <Avatar
                            activeOpacity={0.2}
                            containerStyle={{ backgroundColor: "#BDBDBD" }}
                            rounded
                            size="large"
                            source={{ uri: receiver.avatar}}
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                            this.setState({incomingModalVisible:false});
                                            this.acceptCall();
                                            //this.props.navigation.navigate('CallScreen',{call:this.state.call})
                                }
                            }
                        >
                            <Text style={styles.textStyle}>Accept</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => {this.setState({incomingModalVisible:false});
                                            this.rejectCall('REJECT')}}
                            >
                            <Text style={styles.textStyle}>Reject</Text>
                    </Pressable>
                        </View>
                    </View>
                    </Modal>

                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.outgoingModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setState({outgoingModalVisible:false})
                    }}
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>Calling {receiver.name}</Text>
                        <Avatar
                            activeOpacity={0.2}
                            containerStyle={{ backgroundColor: "#BDBDBD" }}
                            rounded
                            size="large"
                            source={{ uri: receiver.avatar}}
                        />
                        
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => {this.setState({outgoingModalVisible:false})
                                            this.rejectCall("CANCEL")}}
                            >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        </View>
                    </View>
                    </Modal>
                    
                </View>
    
                   <FlatList
                            data={this.state.messages}
                            renderItem={this.renderItem}
                            keyExtractor={(item,index)=> index.toString()}
                    />
                    
                    <View> 
                    <KeyboardAvoidingView behavior="padding" style={{flexDirection:'row',justifyContent:"space-evenly",marginTop:20}}> 
                    <TextInput style={{borderWidth:1,width:350,height:60,borderRadius:30}}
                        value={this.state.messageText}
                         onChangeText={(text)=>{
                            this.setState({messageText:text}) }}/>
                    <TouchableOpacity onPress={()=>{this.sendTextMessage()}}>
                        <Icon name="paper-plane" size={30} />
                    </TouchableOpacity>  
                    <TouchableOpacity onPress={()=>{}}>
                        <Icon name="add" size={30} />
                    </TouchableOpacity>  
                    </KeyboardAvoidingView>

                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>{this.sendMessageLink()}}>
                                <Icon name="attach" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.sendMediaMessage()}}>
                                <Icon name="camera" size={20} />
                            </TouchableOpacity>
                        </View>
                </View>
                </ScrollView>
                </SafeAreaView>
                </View>
          )
    }
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });
  