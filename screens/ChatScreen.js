import React from "react";
import {Text,View,SafeAreaView,FlatList,TouchableHighlight} from 'react-native';
import { Avatar,ListItem,Divider} from "react-native-elements";
import {CometChat} from '@cometchat-pro/react-native-chat';
import { TouchableOpacity } from "react-native-gesture-handler";


export default class Chats extends React.Component{
    constructor(){
        super();
        this.state={
            conversationList:[],
        }
    }

    componentDidMount(){
        let limit = 30;
        let conversationsRequest = new CometChat.ConversationsRequestBuilder()
                                                                .setLimit(limit)
                                                                .build();

        conversationsRequest.fetchNext().then(
        conversationList => {
            console.log("Conversations list received:", conversationList);
            this.setState({conversationList:conversationList});
        }, error => {
            console.log("Conversations list fetching failed with error:", error);
        }
        );

        let listenerID = this.state.ruid+"_LISTENER_ID";

        CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
            onTextMessageReceived: textMessage => {
            console.log("Text message received successfully", textMessage);

            },
            onMediaMessageReceived: mediaMessage => {
            console.log("Media message received successfully", mediaMessage);
            },
            onCustomMessageReceived: customMessage => {
            console.log("Custom message received successfully", customMessage);
            }
        })
);
    }

    renderItem=({item})=>{
        return(
            <TouchableOpacity>
            <ListItem
                Component={TouchableHighlight}
                containerStyle={{}}
                disabledStyle={{ opacity: 0.5 }}
                onPress={() => {

                             if(item.conversationType=="user"){
                                this.props.navigation.navigate("OnetoOneConversationScreen",{item:item.conversationWith})
                            }else{
                                this.props.navigation.navigate("GroupConversationScreen",{item:item.conversationWith})
                            }
                             }
                        }
                               
                pad={20}
            >
            <Avatar
                activeOpacity={0.2}
                containerStyle={{ backgroundColor: "#BDBDBD" }}
                onLongPress={() => alert("onLongPress")}
                onPress={() => alert("onPress")}
                rounded
                size="large"
                source={item.conversationType=="user"?({ uri: item?.conversationWith.avatar }):({uri:item.conversationWith.icon})}
            />
            <ListItem.Content>
                <ListItem.Title>
                <Text>{item.conversationType=="user"?(item.conversationWith.name):(item.conversationWith.name)}</Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                <Text>{item.conversationType=="user"?(item.lastMessage.data.text):(undefined)}</Text>
                </ListItem.Subtitle>
            </ListItem.Content>
            </ListItem>
            <Divider
                style={{ width: "100%" }}
                color="#2089dc"
                insetType="left"
                width={1}
                orientation="horizontal"
            />
            </TouchableOpacity>
        )
        
    }


    render(){
        if(this.state.conversationList.length!==0) {
            return(
                <View>
                    <SafeAreaView>
                        <FlatList
                            data={this.state.conversationList}
                            renderItem={this.renderItem}
                            keyExtractor={(item,index)=> index.toString()}
                        />
                    </SafeAreaView>
                </View>
            )
        }
        else{
            return( <View>
                <SafeAreaView>
                   <Text>Loading...</Text>
                </SafeAreaView>
            </View>)
        }
           
        
    }
}