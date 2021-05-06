var express = require('express');
var router = express.Router();
var { QuestModel } = require('../models/quest');
var { LearnerModel } = require('../models/learner');
var { getTwitterUser } = require('../models/twitter');
var Crypto = require('crypto');
var linkifyHtml = require('linkifyjs/html');

console.log(process.env)

const assignHandle = function (req, res, next){
	let handle = null;
	console.log("session", req.session);
	if(req.session.twitter){
		handle = req.session.twitter.name;
	}
	if(req.session.google){
		handle = req.session.google.email.split("@")[0]
	}
	req.handle = handle;
	next()

}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/tags');
});

router.post('/test-hook', function(req, res){
	console.log(req.body)
	res.send("ok")
})

router.get('/create', assignHandle, function(req, res) {
  res.render('create', { handle: req.handle });
});

router.post('/create', assignHandle, async function(req, res) {
  const { handle, title, resources, pol, tags} = req.body;
  console.log(req.handle)
  const questId = Crypto.createHash('md5').update(`${handle}${title}${resources}${pol}`).digest('hex').substr(0,6);
  let username = req.handle;
  let image = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
  if(req.session.twitter){
	  image = (await getTwitterUser(username)).profile_image_url;
  }
  let user = await getTwitterUser(username);
  if(req.session.google){
    image = req.session.google.picture
  }
  const quest = new QuestModel({
    handle: username.toLowerCase(),
    title,
    resources,
    pol,
    questId,
    tags: [],
    profilePicture: image,
  });
  await quest.save();
  res.redirect(`/join/${questId}`);
});

router.get('/edit/quests/:questId', assignHandle, async function(req, res) {
  const { questId } = req.params;
  const quest = await QuestModel.findOne({ questId }).exec();
  if(!quest) res.redirect("/")
  quest.resources = linkifyHtml(quest.resources);
  res.render('edit', { quest, handle: req.handle });
});

router.post('/edit/quests/:questId', assignHandle, async function(req, res) {
  const { title, resources } = req.body;
  const { questId } = req.params;
  const handle = req.handle.toLowerCase()

  let questUpdateObj = {
    title,
    resources,
  }
  await QuestModel.findOneAndUpdate({questId, handle}, {$set: questUpdateObj});
  res.redirect(`/join/${questId}`);
});

router.get('/join/:questId', assignHandle, async function(req, res){
  const { questId } = req.params;
  const quest = await QuestModel.findOne({ questId }).exec();
  if(!quest) res.redirect("/")
  quest.resources = linkifyHtml(quest.resources);
  res.render('join', { quest, handle: req.handle });
});

router.post('/join/:questId', assignHandle, async function(req, res) {
  const { questId } = req.params;
  console.log(req.session.google);
  const quest = await QuestModel.findOne({ questId }).exec();
  let email = req.handle;
  if(!req.files) res.redirect('/join/'+questId)
  const submissionFile = req.files.submission;
  const filename = questId+"_"+email+"_"+Date.now()+"_"+submissionFile.name;
  submissionFile.mv(__dirname+"/../public/uploads/"+ filename)
  const learner = new LearnerModel({
    email, 
    questId,
    submission: filename,
    owner: quest.handle,
    picture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
    timestamp: Date.now(),
  });
  await learner.save();
  res.render('joined', {quest});
});

router.get('/submissions', assignHandle, async function(req, res) {
  if(!req.handle){
	  return res.render('submissionslogin');
  }
  const submissions = await LearnerModel.find({ owner: req.handle }).sort({ timestamp: -1}).exec();
  return res.render('submissions', { submissions });
});

router.get('/tags', async function(req, res) {
  const tags = {};
  const users = {};
  const quests = await QuestModel.find({ }).exec();
  for(i in quests){
    const quest = quests[i];
    if(!users[quest.handle]){
        users[quest.handle] = { count: 0, profilePicture: quest.profilePicture };
    }
    users[quest.handle].count += 1;
    for(j in quest.tags){
      const tag = quest.tags[j];
      if(!tags[tag])
        tags[tag] = 0;
      tags[tag] += 1;
    }
  }
  let tagList = [];
  let userList = [];
  const tagKeys = Object.keys(tags);
  for(i in tagKeys) {
    const tag = tagKeys[i];
    tagList.push({ tag, count: tags[tag] });
  }
  tagList = tagList.sort((a,b) => b.count - a.count);
  const userKeys = Object.keys(users);
  for(i in userKeys) {
    const user = userKeys[i];
    userList.push({ user, count: users[user].count, profilePicture: users[user].profilePicture });
  }
  userList = userList.sort((a,b) => b.count - a.count);
  res.render('tags', { tagList, userList });
})

router.get('/tag/:tag', async function(req, res) {
  const { tag } = req.params;
  const quests = await QuestModel.find({ tags : {"$elemMatch" : { "$eq" : tag }}}).exec();
  console.log(quests);
  res.render('tag', { tag, quests});
});

router.get('/search', async function(req, res) {
  let { query } = req.query;
  query = query.toLowerCase();
  const quests = await QuestModel.find({ $or: [
    { handle: { $regex: ".*"+query+".*"}},
    { title: { $regex: ".*"+query+".*"}},
    { resources: { $regex: ".*"+query+".*"}},
    { tags : {"$elemMatch" : { $regex : ".*"+query+".*" }}}
  ]}).exec();
  console.log(quests);
  res.render('search', { query, quests});
});


router.get('/user/:handle', async function(req, res) {
  const { handle } = req.params;
   let user = {
	   profile_image_url: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
	   name: handle
   }
  const quests = await QuestModel.find({ handle }).exec();
  if(quests.length > 0){
	  user.profile_image_url = quests[0].profilePicture
  }
  res.render('user', { user, quests});
});

router.get('/submissions_all', async function(req, res) {
  if(!req.session.twitter) return res.redirect('/oauth-any/twitter/login?state=/submissions_all');
  if(req.session.twitter.name.toLowerCase() !== "harshakaramchat" && req.session.twitter.name.toLowerCase() !== "madhavanmalolan" && req.session.twitter.name.toLowerCase() !== 'munishspeaks') return;
  const submissions = await LearnerModel.find({ }).sort({ timestamp: -1}).exec();
  const user = await getTwitterUser(req.session.twitter.name);
  return res.render('submissions', { user, submissions });
});


module.exports = router;
