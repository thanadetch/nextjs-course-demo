import React from 'react';
import MeetupDetail from "../../components/meetups/MeetupDetail";
import {MongoClient, ObjectId} from "mongodb";
import Head from "next/head";

export const getStaticPaths = async () => {
    const client = await MongoClient.connect(process.env.DB_HOST)
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, {projection: {_id: 1}}).toArray();
    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({params: {meetupId: meetup._id.toString()}}))
    }
}

export const getStaticProps = async (context) => {
    const meetupId = context.params.meetupId;
    console.log(meetupId)

    const client = await MongoClient.connect(process.env.DB_HOST)
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId)
    });
    client.close();

    return {
        props: {
            meetupData: {
                ...selectedMeetup,
                _id: selectedMeetup._id.toString()
            }
        },
    }
}

const MeetupDetails = ({meetupData}) => {
    return <>
        <Head>
            <title>{meetupData.title}</title>
            <meta name='description' content={meetupData.description}/>
        </Head>
        <MeetupDetail
            image={meetupData.image}
            title={meetupData.title}
            address={meetupData.address}
            description={meetupData.description}
        />
    </>;
};

export default MeetupDetails;
