const { Tag } = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Podcast } = require("../../db/models");

var RSS = require('rss');

/* lets create an rss feed */
var feed = new RSS({
  title: 'The Brooklyn Project Podcast',
  description: 'Conversations about blockchain technology and its applications to society, policy and more.',
  feed_url: 'https://thebkp.com/api/podcasts',
  site_url: 'https://thebkp.com',
  image_url: 'https://s3.us-east-2.amazonaws.com/the-bkp-header-images/thebkp-logo.png',
  managingEditor: 'The Brooklyn Project',
  webMaster: 'The Brooklyn Project',
  copyright: '2019 ConsenSys AG',
  language: 'en',
  categories: ['Blockchain','Infrastructure Investing','Ethereum','Finance'],
  pubDate: 'May 30, 2019 04:00:00 EDT',
  ttl: '60',
  custom_namespaces: {
  'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
      },
  custom_elements: [
    {'itunes:keywords': 'Blockchain, Infrastructure Investing, Ethereum, Finance'},
    {'itunes:explicit': 'no'},
    {'itunes:subtitle': 'Join the collaboration on blockchain law, regulation, and policy.'},
    {'itunes:author': 'The Brooklyn Project'},
    {'itunes:summary': 'Join the collaboration on blockchain law, regulation, and policy.'},
    {'itunes:owner': [
      {'itunes:name': 'The Brooklyn Project Podcast'},
      {'itunes:email': 'info@thebkp.com'} ]
    },
  {'itunes:image': {
    _attr: {
      href: 'https://s3.us-east-2.amazonaws.com/the-bkp-header-images/thebkp-logo.png'
        }
  }},
  {'itunes:category': [
    {_attr: {
        text: 'Technology'
  }},
    {'itunes:category': {
      _attr: {
        text: 'Blockchain'
      }
    }}
  ]}
]
});


// cache the xml to send to clients
var xml = feed.xml();

const cached = [];

const getXML = async (req, res, next) => {
  const podcasts = await Podcast.findAll();
  podcasts.forEach(podcast => {
    if (cached.indexOf(podcast.id) === -1) {
      cached.push(podcast.id);
      feed.item({
        guid: podcast.id,
        title:  podcast.title,
        description: podcast.description,
        url: podcast.url, // link to the item
        categories: [...podcast.categories], // optional - array of item categories
        author: podcast.author, // optional - defaults to feed author property
        date: podcast.createdAt, // any format that js Date can parse.
        enclosure: {
          url  : podcast.url,
          type : 'audio/mpeg',
        },
        custom_elements: [
          {'itunes:keywords': 'Blockchain, Infrastructure Investing, Ethereum, Finance'},
          {'itunes:author': podcast.author},
          {'itunes:subtitle': podcast.description},
          {'itunes:duration': podcast.duration}
        ]
      });
    }

  });
  var xml = feed.xml({indent: true});
  res.type('application/xml');
  res.send(xml);
};

module.exports = {
  getXML
};
