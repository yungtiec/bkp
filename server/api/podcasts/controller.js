const { Tag } = require("../../db/models");
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Podcast } = require("../../db/models");

var RSS = require('rss');

/* lets create an rss feed */
var feed = new RSS({
  title: 'New Territories',
  description: 'New Territories Podcast, a Brooklyn Project initiative for conversations about blockchain, its applications to policy, society and more.',
  feed_url: 'https://thebkp.com/api/podcasts',
  site_url: 'https://thebkp.com',
  image_url: 'https://thebkp-podcasts.s3.amazonaws.com/new-territories-logo.jpg',
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
    {'itunes:subtitle': 'New Territories Podcast, a Brooklyn Project initiative for conversations about blockchain, its applications to policy, society and more.'},
    {'itunes:author': 'The Brooklyn Project'},
    {'itunes:summary': 'New Territories Podcast, a Brooklyn Project initiative for conversations about blockchain, its applications to policy, society and more.'},
    {'itunes:owner': [
      {'itunes:name': 'New Territories'},
      {'itunes:email': 'joyce.lai@consensys.net'} ]
    },
  {'itunes:image': {
    _attr: {
      href: 'https://thebkp-podcasts.s3.amazonaws.com/new-territories-logo.jpg'
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
