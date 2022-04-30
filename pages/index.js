import MeetupList from "../components/meetups/MeetupList";
import {MongoClient} from "mongodb";
import Head from "next/head";

// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         title: 'A First Meetup',
//         image: 'https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is a first meetup!'
//     },
//     {
//         id: 'm2',
//         title: 'A Second Meetup',
//         image: 'https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is a second meetup!'
//     }
//
// ]

export const getStaticProps = async () => {
    const client = await MongoClient.connect('mongodb+srv://root:root@cluster0.vywsr.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    await client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                ...meetup,
                _id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}

// export const getServerSideProps = (context) => {
//     const req = context.req;
//     const res = context.res;
//
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

const HomePage = (props) => {

    return <>
        <Head>
            <title>React Meetups</title>
            <meta name='description' content='Browse a huge list of highly active React meetups'/>
        </Head>
        <MeetupList meetups={props.meetups}/>
    </>
};


export default HomePage;
