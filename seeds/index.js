const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors}= require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database conected");
});

const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for( let i =0; i<50; i++){
        const random1000 = Math.floor( Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
       const camp=  new Campground({
            author: '63654a16cc947f611b18f1ce',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt placeat animi cumque corporis. Ducimus et, voluptatum eligendi ipsam deleniti minima amet eveniet cupiditate, fuga magni alias voluptatem voluptate cumque. Illum.',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dvvrcwnwa/image/upload/v1667737274/Yelpcamp/bmyd9ypok3ezexlouxin.jpg',
                  filename: 'Yelpcamp/bmyd9ypok3ezexlouxin',
                },
                {
                  url: 'https://res.cloudinary.com/dvvrcwnwa/image/upload/v1667737273/Yelpcamp/lre0rlfghzx6euuvnidy.jpg',
                  filename: 'Yelpcamp/lre0rlfghzx6euuvnidy',
                },
                {
                  url: 'https://res.cloudinary.com/dvvrcwnwa/image/upload/v1667737273/Yelpcamp/qhph6rcvvglx2vaafyng.jpg',
                  filename: 'Yelpcamp/qhph6rcvvglx2vaafyng',
                }
              ],
            
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})