import React from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';

class AboutKootaSettings extends React.Component {

    render() {
        return (
            <ScrollView>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>Our Story</Text>
                </View>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: 'black' }}>
                        At graduation, Wes and Josh had an offhand conversation about what
                        they wanted to do after graduation. Josh mentioned that he'd love
                        to start a company at some point. After moving to their respective
                        cities, Wes and Josh both found that making new friends out of
                        school is way more difficult than in school. After looking back,
                        we realized that we mostly got lucky making friends in school and
                        we knew plenty of people that didn't have the same luck and
                        dropped out or transferred because they never developed a social
                        circle. We immediately started brainstorming how we could fix this
                        and came up with the idea for Koota. After trying other apps that
                        were suposed to help us make friends we were disappointed because
                        the events were either too formal and rigid or the whole
                        experience was treated like dating and was awkward as a result. So
                        we built the tool that we wished we had when we moved into a new
                        city or were in college!
                    </Text>
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>Our Team</Text>
                </View>
                <View>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Wes Reynolds - CEO</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <CachedImage
                            source={require('../../assets/images/wes.png')}
                            style={{ width: 200, height: 200 }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                    </View>
                    <View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ color: 'black' }}>
                                In 2nd grade I told my teacher that I wanted to be an inventor;
                                I remember because she gave me a book about it (go teachers). To
                                pursue that dream I attended OU for a mechanical engineering
                                degree, where I was Captain of the Sooner Racing Team - because
                                racecar. After interning at Peterbilt and working for Michelin,
                                Josh & I deciding to launch Koota. Along the way I have had
                                amazing mentors from my scoutmasters in Florida, to General
                                Holmes at OU, who have prepared me to lead Koota’s business
                                side. I look forward to being a part of the community that we
                                can create together with Koota!
                            </Text>
                        </View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ color: 'black' }}>
                                You might find me using Koota when I’m not running it, because I
                                love meeting new friends! I also enjoy all things outdoors
                                (especially canoeing), working on old motorcycles, playing music
                                with friends, and watching anything well engineered, from
                                racecars to rocket launches.
                            </Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Josh Imbriani - CTO</Text></View>
                    <View style={{ alignItems: 'center' }}>
                        <CachedImage
                            source={require('../../assets/images/josh.png')}
                            style={{ width: 200, height: 200 }}
                            ttl={60 * 60 * 24 * 3}
                            fallbackSource={require('../../assets/images/KootaK.png')}
                        />
                    </View>
                    <View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ color: 'black' }}>
                                Hey Internet! So a little about me: I've been interested in
                                startups since the start of high school and have gotten lucky
                                enough to particpate in one a few years ago. I bring that
                                experience to Koota along with multiple launched side projects,
                                internships at CenturyLink and Google and a job at Epic Systems.
                                I'm ready to power the world's best way to meet new people and
                                find awesome things to do!
                            </Text>
                        </View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ color: 'black' }}>
                                So now that we have that business stuff out of the way, let's
                                talk about things I enjoy. I'm a huge theme park fan and have
                                been on over 200 roller coasters, my favorite of which is
                                probably Steel Vengeance at Cedar Point. In addition to theme
                                parks, I also enjoy music, specifically EDM, reading, baseball
                                and technology. My personal website is{' '}
                                <Text style={{ color: 'blue' }}
                                    onPress={() => Linking.openURL('http://joshimbriani.com')}>
                                    joshimbriani.com
                                </Text>
                                and my Twitter is{' '}
                                <Text style={{ color: 'blue' }}
                                    onPress={() => Linking.openURL('https://twitter.com/joshimbriani')}>
                                    @joshimbriani
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
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
)(AboutKootaSettings);