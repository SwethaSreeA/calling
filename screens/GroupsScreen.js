import React from "react";
import {View,SafeAreaView,FlatList,TouchableHighlight,Text, TouchableOpacity } from 'react-native';
import { Avatar,ListItem,Divider} from "react-native-elements";
import {CometChat} from '@cometchat-pro/react-native-chat';

export default class GroupsScreen extends React.Component{
    constructor(){
        super();
        this.state={
            suid:'',
            ruid:'',
            groupList:'',
            conversationList:''
        }
    }

    componentDidMount(){
        let limit = 30;
        let groupsRequest = new CometChat.GroupsRequestBuilder()
                                .setLimit(limit)
                                .build();

        groupsRequest.fetchNext().then(
        groupList => {
            console.log("Groups list fetched successfully", groupList);
            this.setState({groupList:groupList});
        }, error => {
            console.log("Groups list fetching failed with error", error);
        }
        );
    }

    renderItem=({item})=>{
        return(
            <TouchableOpacity>
            <ListItem
                Component={TouchableHighlight}
                containerStyle={{}}
                disabledStyle={{ opacity: 0.5 }}
                onLongPress={() => console.log("onLongPress()")}
                onPress={() => {
                    console.log("onLongPress()");
                    this.props.navigation.navigate("GroupConversationScreen",{item:item})
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
                source={{ uri: item.icon}}
            />
            <ListItem.Content>
                <ListItem.Title>
                <Text>{item.name}</Text>
                </ListItem.Title>
                <ListItem.Subtitle>
              
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
        //console.log(this.state.groupList)
        if(this.state.groupList.length!==0) {
            return(
                <View>
                    <SafeAreaView>
                        <FlatList
                            data={this.state.groupList}
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
        <Text>No groups</Text>
                </SafeAreaView>
            </View>)
        }
    }
}