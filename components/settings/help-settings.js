import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';

class HelpSettings extends React.Component {

    render() {
            return (
                <ScrollView>
                    <View style={{padding: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>Help</Text> 
                    </View>
                    {QAndAs.map((item, index) => {
                        return (
                            <View key={index} style={{padding: 10}}>
                                <View style={{paddingBottom: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>{item.question}</Text>
                                </View>
                                <View style={{paddingBottom: 30}}>
                                    <Text>{item.answer}</Text>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpSettings);

const QAndAs = [
    {
        "question": "Why do you need the app permissions that you do?",
        "answer": "We use all of the permissions to give you a better experience. GPS allows us to only show you the events that are happening closest and we get access to your gallery and camera in order to allow you to upload an avatar of yourself."
    },
    {
        "question": "Someone posted something inappropriate. How do I get rid of it?",
        "answer": "We're really sorry, people suck sometimes! If you ever come across anything on Koota that's inappropriate, just click the report button in the top menu button. That will remove the bad content from the app and let us send it to the appropriate authorities if necessary!"
    },
    {
        "question": "Someone is being creepy to me, what can I do?",
        "answer": "We're really sorry about that! The best way to handle this is to block the person by long-pressing on their image and selecting Block Person in the popup."
    },
    {
        "question": "I have another question but it isn't here, how can I get it answered?",
        "answer": "Good question! If you have another question, go to kootasocial.com/faq to see if it's listed there. If it's still not, tweet us @kootasocial or email us at support@kootasocial.com and we'll be glad to help out!"
    },
]