import React from "react";
import {Text,View,SafeAreaView,FlatList,TouchableHighlight,TouchableOpacity} from 'react-native';
import { Avatar,ListItem,Divider} from "react-native-elements";
import {CometChat} from '@cometchat-pro/react-native-chat';


export default class UsersScreen extends React.Component{
    constructor(){
        super();
        this.state={
            suid:'',
            ruid:'',
            userList:'',
            conversationList:''
        }
    }

    componentDidMount(){
        var limit = 30;
        var usersRequest = new CometChat.UsersRequestBuilder()
                                                    .setLimit(limit)
                                                    .build();

        usersRequest.fetchNext().then(
        userList => {
            console.log("User list received:", userList);
            this.setState({userList:userList})
        }, error => {
            console.log("User list fetching failed with error:", error);
        }
        );
    }

    renderItem=({item})=>{
        console.log(item);
        return(
            <TouchableOpacity>
            <ListItem
                Component={TouchableHighlight}
                containerStyle={{}}
                disabledStyle={{ opacity: 0.5 }}
                onLongPress={() => console.log("onLongPress()")}
                onPress={() => {
                    console.log("onLongPress()");
                    this.props.navigation.navigate("OnetoOneConversationScreen",{item:item})
                }}
                pad={20}
            >
            <Avatar
                activeOpacity={0.2}
                containerStyle={{ backgroundColor: "#BDBDBD" }}
                onLongPress={() => alert("onLongPress")}
                onPress={() => alert("onPress")}
                rounded
                size="large"
                source={{ uri: item.avatar }}
            />
            <ListItem.Content>
                <ListItem.Title>
                <Text>{item.name}</Text>
                </ListItem.Title>
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
        if(this.state.userList.length!==0) {
            return(
                <View>
                    <SafeAreaView>
                        <FlatList
                            data={this.state.userList}
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