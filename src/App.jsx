import { useState, useEffect } from "react";

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#000000", card:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.10)",
  nykBlue:"#1A8FE3", nykOrange:"#FF8C2A", sasSilver:"#D8E4EC",
  gold:"#D4A843", goldLight:"#F5DC80", goldDim:"#9A7A35",
  dim:"#6A7A90", mid:"#8A9BB5", light:"#B0C0D8", text:"#F0F4FA",
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const SCHEDULE = [
  {game:1,date:"Wed, Jun 4", time:"8:30 PM ET",home:"SAS",away:"NYK",status:"next",       network:"ABC"},
  {game:2,date:"Fri, Jun 6", time:"8:30 PM ET",home:"SAS",away:"NYK",status:"scheduled",  network:"ABC"},
  {game:3,date:"Mon, Jun 9", time:"8:30 PM ET",home:"NYK",away:"SAS",status:"scheduled",  network:"ABC"},
  {game:4,date:"Wed, Jun 11",time:"8:30 PM ET",home:"NYK",away:"SAS",status:"scheduled",  network:"ESPN"},
  {game:5,date:"Sat, Jun 14",time:"8:30 PM ET",home:"SAS",away:"NYK",status:"if-necessary",network:"ABC"},
  {game:6,date:"Tue, Jun 17",time:"8:30 PM ET",home:"NYK",away:"SAS",status:"if-necessary",network:"ABC"},
  {game:7,date:"Fri, Jun 20",time:"8:30 PM ET",home:"SAS",away:"NYK",status:"if-necessary",network:"ABC"},
];

const STATS_DATA = {
  categories:[
    {key:"ppg",label:"Points",higher:"better",nykRank:"10th",sasRank:"3rd"},
    {key:"pace",label:"Pace",higher:"better",nykRank:"T26th",sasRank:"13th"},
    {key:"fgp",label:"FG%",higher:"better",nykRank:"11th",sasRank:"6th"},
    {key:"3pfg",label:"3PT Made",higher:"better",nykRank:"10th",sasRank:"16th"},
    {key:"3pp",label:"3PT%",higher:"better",nykRank:"4th",sasRank:"T14th"},
    {key:"ftp",label:"FT%",higher:"better",nykRank:"T10th",sasRank:"12th"},
    {key:"reb",label:"Rebounds",higher:"better",nykRank:"T7th",sasRank:"2nd"},
    {key:"oreb",label:"Off. Rebounds",higher:"better",nykRank:"6th",sasRank:"T14th"},
    {key:"ast",label:"Assists",higher:"better",nykRank:"13th",sasRank:"9th"},
    {key:"stl",label:"Steals",higher:"better",nykRank:"19th",sasRank:"25th"},
    {key:"tov",label:"Turnovers",higher:"lower",nykRank:"5th",sasRank:"4th"},
    {key:"ts",label:"True Shooting%",higher:"better",nykRank:"8th",sasRank:"T5th"},
  ],
  regular:{NYK:{ppg:116.5,pace:96.1,fgp:47.8,"3pfg":14.2,"3pp":37.3,ftp:79.2,reb:45.6,oreb:12.7,ast:27.4,stl:8.1,tov:12.8,ts:59.0},SAS:{ppg:119.8,pace:99.2,fgp:48.3,"3pfg":13.6,"3pp":35.9,ftp:78.7,reb:47.0,oreb:11.4,ast:28.1,stl:7.5,tov:12.7,ts:59.5}},
  playoffs:{NYK:{ppg:124.5,pace:97.2,fgp:50.9,"3pfg":11.9,"3pp":35.5,ftp:84.4,reb:47.4,oreb:11.6,ast:29.5,stl:8.1,tov:13.8,ts:61.2},SAS:{ppg:122.1,pace:98.1,fgp:45.9,"3pfg":16.8,"3pp":38.1,ftp:83.4,reb:46.8,oreb:14.8,ast:27.7,stl:8.5,tov:12.9,ts:60.8}},
  h2h:{NYK:{ppg:123.0,pace:102.1,fgp:49.2,"3pfg":15.5,"3pp":38.8,ftp:81.5,reb:44.0,oreb:11.5,ast:28.5,stl:8.5,tov:13.5,ts:60.5},SAS:{ppg:111.5,pace:102.1,fgp:46.8,"3pfg":14.0,"3pp":36.2,ftp:80.0,reb:43.5,oreb:12.0,ast:27.0,stl:7.0,tov:14.0,ts:58.8}},
};

// Player game logs (playoff game-by-game)
const NYK_PLAYERS = [
  { name:"Jalen Brunson",    pos:"PG",jersey:11,
    reg:{ppg:26.0,rpg:3.1,apg:6.8,spg:0.8,bpg:0.2,fgp:48.2,tpp:38.1,ftp:87.4,tov:2.7},
    ply:{ppg:27.9,rpg:3.8,apg:8.2,spg:0.9,bpg:0.1,fgp:50.1,tpp:34.2,ftp:89.0,tov:2.6},
    role:"Engine",note:"27.9 PPG playoffs · clutch 4Q scorer · 11-game win streak captain",
    log:[
      {opp:"ATL",g:1,res:"W",pts:28,reb:4,ast:9,stl:1,blk:0,fgm:10,fga:19,tpm:2,tpa:6,min:38},
      {opp:"ATL",g:2,res:"W",pts:31,reb:3,ast:7,stl:0,blk:0,fgm:11,fga:20,tpm:3,tpa:8,min:40},
      {opp:"ATL",g:3,res:"L",pts:22,reb:2,ast:8,stl:1,blk:0,fgm:8,fga:18,tpm:1,tpa:5,min:38},
      {opp:"ATL",g:4,res:"W",pts:30,reb:4,ast:10,stl:2,blk:0,fgm:11,fga:21,tpm:2,tpa:7,min:41},
      {opp:"ATL",g:5,res:"L",pts:24,reb:3,ast:6,stl:1,blk:0,fgm:9,fga:20,tpm:2,tpa:6,min:38},
      {opp:"ATL",g:6,res:"W",pts:29,reb:4,ast:9,stl:0,blk:0,fgm:10,fga:18,tpm:3,tpa:7,min:40},
      {opp:"PHI",g:1,res:"W",pts:26,reb:3,ast:8,stl:1,blk:0,fgm:10,fga:20,tpm:1,tpa:4,min:37},
      {opp:"PHI",g:2,res:"W",pts:29,reb:4,ast:9,stl:0,blk:0,fgm:11,fga:21,tpm:2,tpa:5,min:38},
      {opp:"PHI",g:3,res:"W",pts:28,reb:3,ast:7,stl:2,blk:0,fgm:10,fga:19,tpm:2,tpa:6,min:39},
      {opp:"PHI",g:4,res:"W",pts:25,reb:3,ast:8,stl:1,blk:0,fgm:9,fga:18,tpm:1,tpa:4,min:36},
      {opp:"CLE",g:1,res:"W",pts:29,reb:3,ast:9,stl:1,blk:0,fgm:10,fga:19,tpm:0,tpa:4,min:41},
      {opp:"CLE",g:2,res:"W",pts:27,reb:4,ast:8,stl:0,blk:0,fgm:10,fga:20,tpm:2,tpa:6,min:40},
      {opp:"CLE",g:3,res:"W",pts:31,reb:4,ast:10,stl:1,blk:0,fgm:11,fga:19,tpm:0,tpa:4,min:41},
      {opp:"CLE",g:4,res:"W",pts:26,reb:3,ast:9,stl:1,blk:0,fgm:9,fga:18,tpm:1,tpa:4,min:38},
    ]},
  { name:"Karl-A. Towns",   pos:"C",jersey:32,
    reg:{ppg:20.1,rpg:11.9,apg:3.2,spg:0.6,bpg:0.5,fgp:52.3,tpp:40.1,ftp:84.2,tov:2.8},
    ply:{ppg:19.8,rpg:12.4,apg:3.0,spg:0.7,bpg:0.6,fgp:54.8,tpp:37.5,ftp:87.0,tov:2.4},
    role:"Paint anchor",note:"Playoff RPG leader · foul trouble risk vs Wemby",
    log:[
      {opp:"ATL",g:1,res:"W",pts:22,reb:14,ast:3,stl:1,blk:1,fgm:8,fga:14,tpm:1,tpa:3,min:30},
      {opp:"ATL",g:2,res:"W",pts:19,reb:12,ast:2,stl:0,blk:1,fgm:7,fga:13,tpm:1,tpa:2,min:28},
      {opp:"ATL",g:3,res:"L",pts:14,reb:10,ast:3,stl:1,blk:0,fgm:5,fga:11,tpm:0,tpa:2,min:26},
      {opp:"ATL",g:4,res:"W",pts:23,reb:13,ast:4,stl:0,blk:1,fgm:9,fga:15,tpm:2,tpa:4,min:31},
      {opp:"ATL",g:5,res:"L",pts:16,reb:11,ast:2,stl:1,blk:0,fgm:6,fga:12,tpm:1,tpa:3,min:27},
      {opp:"ATL",g:6,res:"W",pts:21,reb:13,ast:3,stl:0,blk:1,fgm:8,fga:14,tpm:1,tpa:3,min:30},
      {opp:"PHI",g:1,res:"W",pts:20,reb:12,ast:3,stl:1,blk:1,fgm:8,fga:14,tpm:1,tpa:2,min:31},
      {opp:"PHI",g:2,res:"W",pts:22,reb:13,ast:2,stl:0,blk:0,fgm:9,fga:15,tpm:1,tpa:3,min:32},
      {opp:"PHI",g:3,res:"W",pts:18,reb:14,ast:3,stl:1,blk:1,fgm:7,fga:13,tpm:1,tpa:2,min:29},
      {opp:"PHI",g:4,res:"W",pts:16,reb:12,ast:4,stl:0,blk:1,fgm:6,fga:11,tpm:0,tpa:2,min:28},
      {opp:"CLE",g:1,res:"W",pts:21,reb:14,ast:3,stl:1,blk:1,fgm:8,fga:14,tpm:2,tpa:4,min:30},
      {opp:"CLE",g:2,res:"W",pts:19,reb:12,ast:2,stl:0,blk:0,fgm:7,fga:13,tpm:1,tpa:2,min:29},
      {opp:"CLE",g:3,res:"W",pts:20,reb:16,ast:3,stl:1,blk:1,fgm:8,fga:13,tpm:1,tpa:3,min:31},
      {opp:"CLE",g:4,res:"W",pts:17,reb:13,ast:4,stl:0,blk:1,fgm:6,fga:11,tpm:0,tpa:2,min:28},
    ]},
  { name:"OG Anunoby",     pos:"SF",jersey:8,
    reg:{ppg:16.7,rpg:5.2,apg:2.1,spg:1.6,bpg:0.7,fgp:51.2,tpp:38.8,ftp:78.6,tov:1.4},
    ply:{ppg:19.5,rpg:5.8,apg:2.2,spg:2.0,bpg:0.7,fgp:62.0,tpp:42.0,ftp:91.0,tov:1.2},
    role:"Two-way menace",note:"~20 PPG on 62% FG · hamstring being monitored",
    log:[
      {opp:"ATL",g:1,res:"W",pts:18,reb:6,ast:2,stl:2,blk:1,fgm:7,fga:11,tpm:2,tpa:4,min:32},
      {opp:"ATL",g:2,res:"W",pts:22,reb:5,ast:2,stl:3,blk:0,fgm:9,fga:13,tpm:2,tpa:4,min:34},
      {opp:"ATL",g:3,res:"L",pts:14,reb:4,ast:1,stl:1,blk:1,fgm:5,fga:9,tpm:1,tpa:3,min:30},
      {opp:"ATL",g:4,res:"W",pts:21,reb:6,ast:3,stl:2,blk:1,fgm:8,fga:12,tpm:2,tpa:4,min:33},
      {opp:"ATL",g:5,res:"L",pts:16,reb:5,ast:2,stl:1,blk:0,fgm:6,fga:10,tpm:1,tpa:3,min:31},
      {opp:"ATL",g:6,res:"W",pts:20,reb:6,ast:2,stl:2,blk:1,fgm:8,fga:12,tpm:2,tpa:4,min:33},
      {opp:"PHI",g:1,res:"W",pts:19,reb:6,ast:2,stl:2,blk:1,fgm:8,fga:12,tpm:2,tpa:4,min:33},
      {opp:"PHI",g:2,res:"W",pts:22,reb:6,ast:2,stl:2,blk:0,fgm:9,fga:13,tpm:2,tpa:4,min:34},
      {opp:"PHI",g:3,res:"W",pts:20,reb:5,ast:2,stl:2,blk:1,fgm:8,fga:12,tpm:2,tpa:4,min:32},
      {opp:"PHI",g:4,res:"W",pts:18,reb:6,ast:3,stl:1,blk:1,fgm:7,fga:11,tpm:2,tpa:4,min:31},
      {opp:"CLE",g:1,res:"W",pts:17,reb:6,ast:2,stl:2,blk:1,fgm:7,fga:11,tpm:1,tpa:3,min:32},
      {opp:"CLE",g:2,res:"W",pts:20,reb:5,ast:2,stl:2,blk:0,fgm:8,fga:12,tpm:2,tpa:4,min:33},
      {opp:"CLE",g:3,res:"W",pts:22,reb:6,ast:2,stl:3,blk:1,fgm:9,fga:13,tpm:2,tpa:4,min:34},
      {opp:"CLE",g:4,res:"W",pts:28,reb:5,ast:2,stl:2,blk:1,fgm:11,fga:15,tpm:3,tpa:5,min:33},
    ]},
  { name:"Mikal Bridges",   pos:"SF",jersey:25,
    reg:{ppg:14.4,rpg:3.8,apg:3.7,spg:1.3,bpg:0.8,fgp:47.5,tpp:38.2,ftp:82.0,tov:1.5},
    ply:{ppg:19.7,rpg:4.7,apg:2.0,spg:2.0,bpg:0.7,fgp:59.0,tpp:50.0,ftp:100.0,tov:1.2},
    role:"Resurgent wing",note:"71/50/100 ECF shooting splits · elite on-ball defender",
    log:[
      {opp:"ATL",g:1,res:"W",pts:14,reb:4,ast:2,stl:1,blk:1,fgm:6,fga:13,tpm:1,tpa:4,min:32},
      {opp:"ATL",g:2,res:"W",pts:16,reb:5,ast:2,stl:2,blk:0,fgm:7,fga:13,tpm:2,tpa:4,min:33},
      {opp:"ATL",g:3,res:"L",pts:11,reb:3,ast:2,stl:1,blk:0,fgm:4,fga:10,tpm:1,tpa:4,min:30},
      {opp:"ATL",g:4,res:"W",pts:18,reb:5,ast:2,stl:2,blk:1,fgm:7,fga:12,tpm:2,tpa:4,min:33},
      {opp:"ATL",g:5,res:"L",pts:13,reb:4,ast:2,stl:1,blk:0,fgm:5,fga:11,tpm:1,tpa:4,min:31},
      {opp:"ATL",g:6,res:"W",pts:20,reb:5,ast:2,stl:2,blk:1,fgm:8,fga:12,tpm:3,tpa:5,min:34},
      {opp:"PHI",g:1,res:"W",pts:18,reb:5,ast:2,stl:2,blk:1,fgm:7,fga:12,tpm:2,tpa:4,min:33},
      {opp:"PHI",g:2,res:"W",pts:21,reb:4,ast:2,stl:2,blk:0,fgm:8,fga:13,tpm:3,tpa:5,min:34},
      {opp:"PHI",g:3,res:"W",pts:20,reb:5,ast:2,stl:2,blk:1,fgm:8,fga:13,tpm:3,tpa:5,min:33},
      {opp:"PHI",g:4,res:"W",pts:22,reb:5,ast:2,stl:2,blk:1,fgm:9,fga:14,tpm:3,tpa:5,min:34},
      {opp:"CLE",g:1,res:"W",pts:19,reb:5,ast:2,stl:2,blk:1,fgm:8,fga:13,tpm:2,tpa:4,min:33},
      {opp:"CLE",g:2,res:"W",pts:25,reb:5,ast:2,stl:2,blk:0,fgm:10,fga:15,tpm:3,tpa:5,min:35},
      {opp:"CLE",g:3,res:"W",pts:21,reb:4,ast:2,stl:2,blk:1,fgm:9,fga:13,tpm:3,tpa:5,min:34},
      {opp:"CLE",g:4,res:"W",pts:18,reb:5,ast:2,stl:2,blk:1,fgm:7,fga:12,tpm:2,tpa:4,min:33},
    ]},
  { name:"Josh Hart",       pos:"SG",jersey:3,
    reg:{ppg:12.0,rpg:7.4,apg:4.8,spg:1.1,bpg:0.3,fgp:47.8,tpp:38.5,ftp:74.0,tov:1.8},
    ply:{ppg:11.2,rpg:8.5,apg:5.1,spg:1.5,bpg:0.3,fgp:46.0,tpp:37.0,ftp:76.0,tov:1.6},
    role:"Gritty glue guy",note:"ECF G3: 12pts 9reb 5ast 4stl · plays through anything",
    log:[
      {opp:"ATL",g:1,res:"W",pts:11,reb:8,ast:5,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:35},
      {opp:"ATL",g:2,res:"W",pts:13,reb:9,ast:5,stl:2,blk:0,fgm:5,fga:10,tpm:1,tpa:3,min:36},
      {opp:"ATL",g:3,res:"L",pts:8,reb:7,ast:4,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:33},
      {opp:"ATL",g:4,res:"W",pts:12,reb:9,ast:6,stl:2,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:36},
      {opp:"ATL",g:5,res:"L",pts:9,reb:7,ast:4,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:34},
      {opp:"ATL",g:6,res:"W",pts:14,reb:9,ast:6,stl:2,blk:0,fgm:5,fga:10,tpm:1,tpa:3,min:36},
      {opp:"PHI",g:1,res:"W",pts:10,reb:8,ast:5,stl:1,blk:0,fgm:4,fga:9,tpm:0,tpa:2,min:35},
      {opp:"PHI",g:2,res:"W",pts:11,reb:8,ast:5,stl:2,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:35},
      {opp:"PHI",g:3,res:"W",pts:10,reb:9,ast:5,stl:2,blk:0,fgm:4,fga:9,tpm:0,tpa:2,min:35},
      {opp:"PHI",g:4,res:"W",pts:9,reb:8,ast:5,stl:1,blk:0,fgm:3,fga:8,tpm:1,tpa:3,min:34},
      {opp:"CLE",g:1,res:"W",pts:10,reb:8,ast:5,stl:1,blk:0,fgm:4,fga:9,tpm:0,tpa:2,min:35},
      {opp:"CLE",g:2,res:"W",pts:11,reb:9,ast:5,stl:2,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:36},
      {opp:"CLE",g:3,res:"W",pts:12,reb:9,ast:5,stl:4,blk:0,fgm:5,fga:12,tpm:2,tpa:7,min:35},
      {opp:"CLE",g:4,res:"W",pts:10,reb:8,ast:5,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:34},
    ]},
  { name:"Mitchell Robinson", pos:"C",  jersey:23,
    reg:{ppg:7.8,rpg:9.2,apg:0.5,spg:0.9,bpg:1.2,fgp:68.0,tpp:0.0,ftp:52.0,tov:1.0},
    ply:{ppg:6.8,rpg:7.8,apg:0.4,spg:0.8,bpg:1.1,fgp:65.0,tpp:0.0,ftp:50.0,tov:0.8},
    role:"Rim protector",note:"Playing through broken pinkie · elite offensive rebounder" },
  { name:"Landry Shamet",    pos:"SG", jersey:14,
    reg:{ppg:8.4,rpg:2.1,apg:1.8,spg:0.5,bpg:0.1,fgp:43.0,tpp:40.2,ftp:88.0,tov:1.0},
    ply:{ppg:7.2,rpg:1.8,apg:1.5,spg:0.4,bpg:0.1,fgp:44.0,tpp:42.0,ftp:90.0,tov:0.8},
    role:"Bench sniper",note:"Sharpshooting spark off the bench · 40%+ from 3" },
  { name:"Miles McBride",    pos:"PG", jersey:2,
    reg:{ppg:9.2,rpg:2.4,apg:3.1,spg:1.0,bpg:0.2,fgp:43.5,tpp:38.0,ftp:84.0,tov:1.1},
    ply:{ppg:7.5,rpg:2.0,apg:2.6,spg:0.9,bpg:0.2,fgp:41.0,tpp:36.0,ftp:85.0,tov:0.9},
    role:"Backup PG",note:"Pesky perimeter defender · reliable bench ball-handler" },
  { name:"Jose Alvarado",    pos:"PG", jersey:15,
    reg:{ppg:6.8,rpg:1.9,apg:3.8,spg:1.0,bpg:0.1,fgp:42.0,tpp:35.0,ftp:80.0,tov:1.2},
    ply:{ppg:5.5,rpg:1.6,apg:3.0,spg:0.9,bpg:0.1,fgp:40.0,tpp:33.0,ftp:82.0,tov:1.0},
    role:"Energy guard",note:"High-motor pest defender off the bench" },
  { name:"Ariel Hukporti",   pos:"C",  jersey:55,
    reg:{ppg:4.2,rpg:4.0,apg:0.5,spg:0.3,bpg:0.7,fgp:60.0,tpp:0.0,ftp:62.0,tov:0.6},
    ply:{ppg:3.0,rpg:3.2,apg:0.3,spg:0.2,bpg:0.5,fgp:58.0,tpp:0.0,ftp:60.0,tov:0.5},
    role:"Backup big",note:"Rotational center · rim runner and shot contester" },
];

const SAS_PLAYERS = [
  { name:"V. Wembanyama",  pos:"C",jersey:1,
    reg:{ppg:25.0,rpg:11.5,apg:3.1,spg:1.0,bpg:3.6,fgp:47.8,tpp:35.9,ftp:82.0,tov:3.2},
    ply:{ppg:28.2,rpg:11.5,apg:3.3,spg:1.4,bpg:2.7,fgp:48.2,tpp:37.1,ftp:92.0,tov:3.0},
    role:"Generational talent",note:"WCF avg 28.2 PPG · G1 epic 41pts 24reb · joined Wilt Chamberlain in history",
    log:[
      {opp:"POR",g:1,res:"W",pts:26,reb:12,ast:3,stl:1,blk:3,fgm:9,fga:18,tpm:2,tpa:5,min:34},
      {opp:"POR",g:2,res:"W",pts:29,reb:11,ast:4,stl:2,blk:2,fgm:10,fga:20,tpm:2,tpa:6,min:36},
      {opp:"POR",g:3,res:"L",pts:22,reb:10,ast:3,stl:1,blk:3,fgm:8,fga:17,tpm:1,tpa:4,min:33},
      {opp:"POR",g:4,res:"W",pts:30,reb:13,ast:3,stl:1,blk:4,fgm:11,fga:20,tpm:2,tpa:5,min:37},
      {opp:"POR",g:5,res:"W",pts:27,reb:11,ast:3,stl:2,blk:3,fgm:10,fga:19,tpm:2,tpa:5,min:35},
      {opp:"MIN",g:1,res:"W",pts:28,reb:12,ast:3,stl:1,blk:3,fgm:10,fga:20,tpm:2,tpa:5,min:35},
      {opp:"MIN",g:2,res:"L",pts:24,reb:10,ast:3,stl:1,blk:2,fgm:9,fga:18,tpm:1,tpa:4,min:33},
      {opp:"MIN",g:3,res:"W",pts:31,reb:12,ast:4,stl:2,blk:4,fgm:11,fga:20,tpm:3,tpa:7,min:37},
      {opp:"MIN",g:4,res:"W",pts:26,reb:11,ast:3,stl:1,blk:3,fgm:9,fga:18,tpm:2,tpa:5,min:35},
      {opp:"MIN",g:5,res:"L",pts:22,reb:10,ast:3,stl:1,blk:2,fgm:8,fga:17,tpm:1,tpa:4,min:32},
      {opp:"MIN",g:6,res:"W",pts:29,reb:13,ast:3,stl:2,blk:3,fgm:10,fga:19,tpm:2,tpa:6,min:36},
      {opp:"OKC",g:1,res:"W",pts:41,reb:24,ast:3,stl:2,blk:3,fgm:15,fga:26,tpm:3,tpa:8,min:52},
      {opp:"OKC",g:2,res:"L",pts:24,reb:10,ast:3,stl:1,blk:2,fgm:9,fga:18,tpm:2,tpa:5,min:36},
      {opp:"OKC",g:3,res:"L",pts:22,reb:10,ast:3,stl:1,blk:2,fgm:8,fga:17,tpm:1,tpa:4,min:34},
      {opp:"OKC",g:4,res:"W",pts:30,reb:12,ast:3,stl:1,blk:3,fgm:11,fga:20,tpm:3,tpa:7,min:36},
      {opp:"OKC",g:5,res:"L",pts:19,reb:9,ast:3,stl:1,blk:2,fgm:7,fga:16,tpm:1,tpa:4,min:33},
      {opp:"OKC",g:6,res:"W",pts:28,reb:10,ast:3,stl:2,blk:3,fgm:10,fga:21,tpm:4,tpa:9,min:35},
      {opp:"OKC",g:7,res:"W",pts:22,reb:7,ast:3,stl:1,blk:2,fgm:8,fga:17,tpm:2,tpa:5,min:34},
    ]},
  { name:"Stephon Castle",  pos:"SG",jersey:5,
    reg:{ppg:16.7,rpg:4.2,apg:7.4,spg:1.1,bpg:0.3,fgp:46.5,tpp:35.8,ftp:86.0,tov:2.5},
    ply:{ppg:18.3,rpg:4.8,apg:7.8,spg:1.1,bpg:0.4,fgp:46.5,tpp:25.9,ftp:86.0,tov:2.2},
    role:"Young facilitator",note:"Youngest Finals starting PG ever · 5 career triple-doubles",
    log:[
      {opp:"POR",g:1,res:"W",pts:16,reb:4,ast:7,stl:1,blk:0,fgm:6,fga:13,tpm:1,tpa:4,min:32},
      {opp:"POR",g:2,res:"W",pts:19,reb:5,ast:8,stl:1,blk:0,fgm:7,fga:15,tpm:2,tpa:6,min:34},
      {opp:"POR",g:3,res:"L",pts:14,reb:4,ast:6,stl:0,blk:0,fgm:5,fga:12,tpm:0,tpa:3,min:30},
      {opp:"POR",g:4,res:"W",pts:21,reb:5,ast:9,stl:2,blk:1,fgm:8,fga:16,tpm:2,tpa:6,min:35},
      {opp:"POR",g:5,res:"W",pts:18,reb:4,ast:8,stl:1,blk:0,fgm:7,fga:14,tpm:1,tpa:4,min:33},
      {opp:"MIN",g:1,res:"W",pts:19,reb:5,ast:8,stl:1,blk:0,fgm:7,fga:14,tpm:1,tpa:4,min:33},
      {opp:"MIN",g:2,res:"L",pts:15,reb:4,ast:7,stl:0,blk:0,fgm:6,fga:13,tpm:0,tpa:3,min:31},
      {opp:"MIN",g:3,res:"W",pts:20,reb:5,ast:9,stl:1,blk:1,fgm:8,fga:15,tpm:1,tpa:4,min:34},
      {opp:"MIN",g:4,res:"W",pts:17,reb:4,ast:7,stl:1,blk:0,fgm:6,fga:13,tpm:1,tpa:4,min:32},
      {opp:"MIN",g:5,res:"L",pts:14,reb:4,ast:7,stl:0,blk:0,fgm:5,fga:12,tpm:0,tpa:3,min:30},
      {opp:"MIN",g:6,res:"W",pts:22,reb:5,ast:9,stl:2,blk:0,fgm:8,fga:15,tpm:2,tpa:6,min:35},
      {opp:"OKC",g:1,res:"W",pts:17,reb:5,ast:11,stl:1,blk:0,fgm:6,fga:13,tpm:0,tpa:3,min:37},
      {opp:"OKC",g:2,res:"L",pts:15,reb:4,ast:7,stl:1,blk:0,fgm:6,fga:13,tpm:1,tpa:4,min:33},
      {opp:"OKC",g:3,res:"L",pts:16,reb:4,ast:8,stl:0,blk:0,fgm:6,fga:13,tpm:1,tpa:4,min:34},
      {opp:"OKC",g:4,res:"W",pts:21,reb:5,ast:9,stl:1,blk:1,fgm:8,fga:15,tpm:2,tpa:6,min:35},
      {opp:"OKC",g:5,res:"L",pts:15,reb:4,ast:7,stl:0,blk:0,fgm:5,fga:12,tpm:1,tpa:4,min:32},
      {opp:"OKC",g:6,res:"W",pts:17,reb:5,ast:9,stl:1,blk:0,fgm:6,fga:13,tpm:1,tpa:4,min:34},
      {opp:"OKC",g:7,res:"W",pts:20,reb:4,ast:8,stl:1,blk:0,fgm:7,fga:14,tpm:1,tpa:4,min:35},
    ]},
  { name:"De'Aaron Fox",    pos:"PG",jersey:4,
    reg:{ppg:18.6,rpg:3.8,apg:6.2,spg:1.2,bpg:0.2,fgp:47.0,tpp:33.0,ftp:76.0,tov:2.8},
    ply:{ppg:10.3,rpg:6.5,apg:6.5,spg:1.3,bpg:0.2,fgp:33.3,tpp:13.3,ftp:71.4,tov:2.5},
    role:"Veteran playmaker",note:"Ice cold late WCF · 1-9 FG in G6 · bounce-back candidate or liability",
    log:[
      {opp:"POR",g:1,res:"W",pts:20,reb:4,ast:7,stl:2,blk:0,fgm:8,fga:15,tpm:1,tpa:3,min:32},
      {opp:"POR",g:2,res:"W",pts:22,reb:4,ast:7,stl:1,blk:0,fgm:9,fga:17,tpm:1,tpa:3,min:34},
      {opp:"POR",g:3,res:"L",pts:16,reb:4,ast:6,stl:1,blk:0,fgm:6,fga:14,tpm:0,tpa:2,min:30},
      {opp:"POR",g:4,res:"W",pts:18,reb:4,ast:7,stl:2,blk:0,fgm:7,fga:14,tpm:1,tpa:3,min:33},
      {opp:"POR",g:5,res:"W",pts:21,reb:4,ast:7,stl:1,blk:0,fgm:8,fga:16,tpm:1,tpa:3,min:34},
      {opp:"MIN",g:1,res:"W",pts:18,reb:4,ast:7,stl:1,blk:0,fgm:7,fga:15,tpm:1,tpa:3,min:33},
      {opp:"MIN",g:2,res:"L",pts:14,reb:4,ast:6,stl:0,blk:0,fgm:5,fga:13,tpm:0,tpa:2,min:30},
      {opp:"MIN",g:3,res:"W",pts:20,reb:4,ast:7,stl:2,blk:0,fgm:8,fga:15,tpm:1,tpa:3,min:33},
      {opp:"MIN",g:4,res:"W",pts:17,reb:4,ast:7,stl:1,blk:0,fgm:7,fga:14,tpm:1,tpa:3,min:32},
      {opp:"MIN",g:5,res:"L",pts:13,reb:4,ast:6,stl:1,blk:0,fgm:5,fga:13,tpm:0,tpa:2,min:29},
      {opp:"MIN",g:6,res:"W",pts:18,reb:4,ast:7,stl:1,blk:0,fgm:7,fga:15,tpm:1,tpa:3,min:32},
      {opp:"OKC",g:1,res:"W",pts:12,reb:6,ast:7,stl:1,blk:0,fgm:5,fga:14,tpm:0,tpa:2,min:30},
      {opp:"OKC",g:2,res:"L",pts:14,reb:6,ast:7,stl:1,blk:0,fgm:5,fga:14,tpm:0,tpa:2,min:31},
      {opp:"OKC",g:3,res:"L",pts:10,reb:6,ast:7,stl:1,blk:0,fgm:4,fga:13,tpm:0,tpa:2,min:30},
      {opp:"OKC",g:4,res:"W",pts:12,reb:7,ast:7,stl:1,blk:0,fgm:4,fga:12,tpm:0,tpa:2,min:30},
      {opp:"OKC",g:5,res:"L",pts:8,reb:6,ast:6,stl:1,blk:0,fgm:3,fga:11,tpm:0,tpa:2,min:28},
      {opp:"OKC",g:6,res:"W",pts:5,reb:6,ast:7,stl:1,blk:0,fgm:1,fga:9,tpm:0,tpa:3,min:26},
      {opp:"OKC",g:7,res:"W",pts:10,reb:6,ast:6,stl:1,blk:0,fgm:4,fga:12,tpm:0,tpa:2,min:29},
    ]},
  { name:"Dylan Harper",    pos:"SG",jersey:2,
    reg:{ppg:12.0,rpg:4.2,apg:3.9,spg:0.8,bpg:0.4,fgp:43.6,tpp:29.4,ftp:82.6,tov:1.8},
    ply:{ppg:12.0,rpg:5.5,apg:3.3,spg:1.7,bpg:0.4,fgp:43.6,tpp:29.4,ftp:82.6,tov:1.4},
    role:"Explosive rookie",note:"WCF G1 historic: 24pts 11reb 7stl · fearless 20-year-old",
    log:[
      {opp:"POR",g:1,res:"W",pts:10,reb:5,ast:3,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:22},
      {opp:"POR",g:2,res:"W",pts:12,reb:5,ast:3,stl:2,blk:0,fgm:5,fga:11,tpm:1,tpa:3,min:24},
      {opp:"POR",g:3,res:"L",pts:8,reb:4,ast:3,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:20},
      {opp:"POR",g:4,res:"W",pts:13,reb:5,ast:4,stl:2,blk:1,fgm:5,fga:10,tpm:1,tpa:3,min:24},
      {opp:"POR",g:5,res:"W",pts:11,reb:5,ast:3,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:22},
      {opp:"MIN",g:1,res:"W",pts:11,reb:5,ast:3,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:22},
      {opp:"MIN",g:2,res:"L",pts:8,reb:4,ast:3,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:20},
      {opp:"MIN",g:3,res:"W",pts:13,reb:6,ast:4,stl:2,blk:0,fgm:5,fga:10,tpm:1,tpa:3,min:24},
      {opp:"MIN",g:4,res:"W",pts:11,reb:5,ast:3,stl:1,blk:0,fgm:4,fga:9,tpm:1,tpa:3,min:22},
      {opp:"MIN",g:5,res:"L",pts:8,reb:4,ast:3,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:20},
      {opp:"MIN",g:6,res:"W",pts:14,reb:6,ast:4,stl:2,blk:1,fgm:5,fga:10,tpm:2,tpa:4,min:24},
      {opp:"OKC",g:1,res:"W",pts:24,reb:11,ast:6,stl:7,blk:0,fgm:9,fga:18,tpm:2,tpa:6,min:34},
      {opp:"OKC",g:2,res:"L",pts:8,reb:4,ast:3,stl:1,blk:0,fgm:3,fga:9,tpm:0,tpa:2,min:22},
      {opp:"OKC",g:3,res:"L",pts:7,reb:4,ast:3,stl:1,blk:0,fgm:3,fga:8,tpm:0,tpa:2,min:21},
      {opp:"OKC",g:4,res:"W",pts:12,reb:5,ast:4,stl:2,blk:0,fgm:5,fga:10,tpm:1,tpa:3,min:24},
      {opp:"OKC",g:5,res:"L",pts:5,reb:4,ast:3,stl:1,blk:0,fgm:2,fga:7,tpm:0,tpa:2,min:19},
      {opp:"OKC",g:6,res:"W",pts:18,reb:6,ast:4,stl:2,blk:0,fgm:7,fga:12,tpm:2,tpa:4,min:26},
      {opp:"OKC",g:7,res:"W",pts:12,reb:5,ast:3,stl:1,blk:0,fgm:5,fga:10,tpm:1,tpa:3,min:23},
    ]},
  { name:"Devin Vassell",    pos:"SF", jersey:24,
    reg:{ppg:13.9,rpg:4.0,apg:2.4,spg:0.8,bpg:0.5,fgp:42.9,tpp:42.6,ftp:85.7,tov:1.5},
    ply:{ppg:14.3,rpg:4.7,apg:2.3,spg:1.8,bpg:0.5,fgp:42.9,tpp:42.6,ftp:85.7,tov:1.2},
    role:"3&D wing",note:"42.6% from 3 in WCF · consistent two-way contributor" },
  { name:"Julian Champagnie",pos:"SF", jersey:30,
    reg:{ppg:10.5,rpg:5.8,apg:1.5,spg:0.6,bpg:0.4,fgp:45.0,tpp:38.2,ftp:80.0,tov:1.0},
    ply:{ppg:10.5,rpg:6.2,apg:1.7,spg:2.5,bpg:0.4,fgp:38.3,tpp:26.7,ftp:71.4,tov:1.1},
    role:"Wing shooter",note:"Dropped career-high 36 (11 threes) vs NYK on Dec 31" },
  { name:"Luke Kornet",      pos:"C",  jersey:7,
    reg:{ppg:5.8,rpg:5.0,apg:1.2,spg:0.4,bpg:1.0,fgp:55.0,tpp:0.0,ftp:70.0,tov:0.8},
    ply:{ppg:2.8,rpg:3.3,apg:0.5,spg:1.3,bpg:0.4,fgp:61.5,tpp:0.0,ftp:50.0,tov:0.6},
    role:"Backup big",note:"His G7 WCF block on SGA sealed the Finals berth" },
  { name:"Keldon Johnson",   pos:"SF", jersey:3,
    reg:{ppg:13.2,rpg:5.4,apg:2.1,spg:0.7,bpg:0.2,fgp:44.0,tpp:33.5,ftp:78.0,tov:1.4},
    ply:{ppg:9.7,rpg:2.8,apg:0.5,spg:0.3,bpg:0.0,fgp:39.7,tpp:32.0,ftp:57.1,tov:1.3},
    role:"Scoring forward",note:"Instant offense off the bench · streaky scorer" },
  { name:"Harrison Barnes",  pos:"SF", jersey:40,
    reg:{ppg:11.8,rpg:4.2,apg:1.4,spg:0.6,bpg:0.2,fgp:45.5,tpp:38.0,ftp:82.0,tov:0.9},
    ply:{ppg:2.7,rpg:1.2,apg:0.0,spg:0.0,bpg:0.0,fgp:25.0,tpp:33.3,ftp:87.5,tov:0.7},
    role:"Veteran wing",note:"Steadying playoff presence · spot-up shooter" },
  { name:"Jeremy Sochan",    pos:"PF", jersey:10,
    reg:{ppg:9.5,rpg:6.8,apg:2.6,spg:0.8,bpg:0.5,fgp:48.0,tpp:30.0,ftp:68.0,tov:1.5},
    ply:{ppg:6.2,rpg:4.5,apg:1.8,spg:0.6,bpg:0.4,fgp:46.0,tpp:28.0,ftp:65.0,tov:1.2},
    role:"Versatile defender",note:"Switchable frontcourt defender · energy and hustle" },
];

const MATCHUPS = [
  {nyk:{name:"Jalen Brunson",pos:"PG"},sas:{name:"Stephon Castle",pos:"SG"},edge:"NYK",label:"PG Battle",
    summary:"Brunson's playoff pedigree and clutch scoring vs Castle's youth and elite assist numbers. Castle is the youngest starting PG in Finals history — Brunson has been here before."},
  {nyk:{name:"Karl-A. Towns",pos:"C"},sas:{name:"V. Wembanyama",pos:"C"},edge:"SAS",label:"The Marquee Matchup",
    summary:"The series-defining battle. Wemby's 3.6 BPG and unprecedented length challenges KAT every possession. If Wemby limits Towns to low efficiency, SAS takes the series."},
  {nyk:{name:"OG Anunoby",pos:"SF"},sas:{name:"Devin Vassell",pos:"SF"},edge:"NYK",label:"Wing Duel",
    summary:"OG is the most efficient scorer in these playoffs at 62% FG. His hamstring health is the only X-factor. Vassell's 42.6% from 3 keeps SAS spacing alive."},
  {nyk:{name:"Mikal Bridges",pos:"SF"},sas:{name:"Dylan Harper",pos:"SG"},edge:"Even",label:"X-Factor Battle",
    summary:"Bridges rediscovered his best form with 71% FG in ECF. Harper is a 20-year-old rookie who made WCF history and isn't afraid of any moment."},
];

// ─── AI Analyzer Config ───────────────────────────────────────────────────────
const GAME_CONTEXT = {
  series:"2026 NBA Finals — NYK vs SAS",
  nyk:{record:"53-29 RS, 11-0 playoffs, +23.8 PPG margin (historic)",playoffPPG:124.5,playoffOPPG:100.7,recentForm:"Swept ATL(4-2→corrected 4-2), PHI(4-0), CLE(4-0). 11 straight wins.",pace:97.2,fgp:50.9,tpp:35.5,tovPG:13.8},
  sas:{record:"62-20 RS, 11-6 playoffs, beat OKC 4-3 WCF",playoffPPG:122.1,playoffOPPG:113.4,recentForm:"Beat OKC in 7. Wemby 28.2 PPG WCF. Fox slumped last 4 WCF games.",pace:98.1,fgp:45.9,tpp:38.1,tovPG:12.9},
  h2h:"1-1 RS this season. NYK won NBA Cup final 124-113. NYK 4-6 last 10 vs SAS all-time.",
  injuries:"Robinson (broken pinkie, playing). OG hamstring monitored. Fox in cold stretch (33.3% FG playoffs).",
  keyMatchup:"Wemby vs KAT is the series pivot. SAS home court G1/G2.",
  players:{
    "Jalen Brunson":    {team:"NYK",pos:"PG",plyPPG:27.9,plyRPG:3.8,plyAPG:8.2,plyFGP:50.1,ply3PP:34.2,regPPG:26.0,trend:"Elite form, 11-game leader, ice in veins"},
    "Karl-A. Towns":    {team:"NYK",pos:"C", plyPPG:19.8,plyRPG:12.4,plyAPG:3.0,plyFGP:54.8,ply3PP:37.5,regPPG:20.1,trend:"Paint beast, Wemby matchup is key, foul trouble risk"},
    "OG Anunoby":       {team:"NYK",pos:"SF",plyPPG:19.5,plyRPG:5.8, plyAPG:2.2,plyFGP:62.0,ply3PP:42.0,regPPG:16.7,trend:"Most efficient playoff scorer, hamstring watch"},
    "Mikal Bridges":    {team:"NYK",pos:"SF",plyPPG:19.7,plyRPG:4.7, plyAPG:2.0,plyFGP:59.0,ply3PP:50.0,regPPG:14.4,trend:"71/50/100 splits ECF, surging"},
    "Josh Hart":        {team:"NYK",pos:"SG",plyPPG:11.2,plyRPG:8.5, plyAPG:5.1,plyFGP:46.0,ply3PP:37.0,regPPG:12.0,trend:"High REB+AST upside, gritty"},
    "V. Wembanyama":    {team:"SAS",pos:"C", plyPPG:28.2,plyRPG:11.5,plyAPG:3.3,plyFGP:48.2,ply3PP:37.1,regPPG:25.0,trend:"28.2 PPG WCF, G1: 41/24, blocks from everywhere"},
    "Stephon Castle":   {team:"SAS",pos:"SG",plyPPG:18.3,plyRPG:4.8, plyAPG:7.8,plyFGP:46.5,ply3PP:25.9,regPPG:16.7,trend:"Youngest Finals PG ever, high AST, 3PT% dipped"},
    "De'Aaron Fox":     {team:"SAS",pos:"PG",plyPPG:10.3,plyRPG:6.5, plyAPG:6.5,plyFGP:33.3,ply3PP:13.3,regPPG:18.6,trend:"Ice cold last 4 games, 1-9 FG in G6"},
    "Dylan Harper":     {team:"SAS",pos:"SG",plyPPG:12.0,plyRPG:5.5, plyAPG:3.3,plyFGP:43.6,ply3PP:29.4,regPPG:12.0,trend:"Historic WCF G1, fearless 20yo, unpredictable"},
    "Devin Vassell":    {team:"SAS",pos:"SF",plyPPG:14.3,plyRPG:4.7, plyAPG:2.3,plyFGP:42.9,ply3PP:42.6,regPPG:13.9,trend:"42.6% from 3 WCF, consistent two-way wing"},
  }
};
const NYK_PLAYERS_LIST = ["Jalen Brunson","Karl-A. Towns","OG Anunoby","Mikal Bridges","Josh Hart"];
const SAS_PLAYERS_LIST = ["V. Wembanyama","Stephon Castle","De'Aaron Fox","Dylan Harper","Devin Vassell"];
const PROP_TYPES = ["Points","Rebounds","Assists","3-Pointers Made","Pts+Reb+Ast","Pts+Reb","Pts+Ast","Reb+Ast","Steals","Blocks","Steals+Blocks","Double-Double","Triple-Double","First Basket"];
const TIER_CFG = {
  suggested:{label:"⭐ Suggested",color:"#D4A843",bg:"rgba(212,168,67,0.10)",border:"rgba(212,168,67,0.4)"},
  safe: {label:"Safe",color:"#22C55E",bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.25)"},
  value:{label:"Value",color:"#F59E0B",bg:"rgba(245,158,11,0.08)",border:"rgba(245,158,11,0.25)"},
  longshot:{label:"Long Shot",color:"#EF4444",bg:"rgba(239,68,68,0.06)",border:"rgba(239,68,68,0.25)"},
  shot: {label:"Long Shot",color:"#EF4444",bg:"rgba(239,68,68,0.06)",border:"rgba(239,68,68,0.25)"},
};

// ─── Detailed player matchup context for the analyzer ────────────────────────
const PLAYER_VS_OPP = {
  "Jalen Brunson":   { vsOppPPG:29.0, homeAvg:28.5, awayAvg:27.2, last3avg:30.3, restBoost:true,  matchup:"Guarded by Stephon Castle (1st yr defender) — Brunson historically torches young PGs. Castle's 3PT% dips off-ball." },
  "Karl-A. Towns":   { vsOppPPG:18.5, homeAvg:21.2, awayAvg:18.0, last3avg:19.5, restBoost:false, matchup:"Primary matchup is Wembanyama — elite shot-blocker, 3.6 BPG. KAT must stay out of foul trouble. Will look for mid-range pull-ups Wemby can't contest." },
  "OG Anunoby":      { vsOppPPG:17.0, homeAvg:20.0, awayAvg:17.5, last3avg:22.7, restBoost:true,  matchup:"Matched up with Vassell — OG's strength, length, and athleticism create extreme mismatch. Hamstring is key risk variable." },
  "Mikal Bridges":   { vsOppPPG:16.5, homeAvg:20.5, awayAvg:18.8, last3avg:21.0, restBoost:false, matchup:"Will draw Harper often — Bridges' ECF breakout (71% FG) built on confident off-ball movement. Harper is raw defensively." },
  "Josh Hart":       { vsOppPPG:10.5, homeAvg:12.0, awayAvg:10.8, last3avg:11.3, restBoost:false, matchup:"High floor REB+AST regardless of matchup. Boards aggressively vs Spurs' switch-heavy defense. Prop value in PRA combos." },
  "V. Wembanyama":   { vsOppPPG:26.5, homeAvg:30.2, awayAvg:26.0, last3avg:26.7, restBoost:true,  matchup:"Primary matchup is KAT — matchup Wemby dominates on both ends. Home court G1/G2 elevates his ceiling. G7 WCF: 22pts. Watch for rest days — performed best with 2+ days rest." },
  "Stephon Castle":  { vsOppPPG:15.0, homeAvg:19.5, awayAvg:16.8, last3avg:18.0, restBoost:false, matchup:"Brunson will test Castle defensively all series. Castle's assist numbers elite but 3PT% fell to 25.9% playoffs — stick to AST props over scoring." },
  "De'Aaron Fox":    { vsOppPPG:17.0, homeAvg:14.0, awayAvg:11.0, last3avg:8.3,  restBoost:true,  matchup:"COLD STREAK: 33.3% FG playoffs, 1-9 FG in G6. Bounce-back narrative exists but NYK's defensive pressure from Bridges/OG is suffocating. Fade scoring props, consider AST over." },
  "Dylan Harper":    { vsOppPPG:11.0, homeAvg:15.0, awayAvg:10.5, last3avg:11.7, restBoost:false, matchup:"Historic G1 WCF (24/11/6/7) but followed by 3 quiet games. High variance rookie. Best in STL/PRA combos given defensive instincts. Unpredictable scoring floor." },
  "Devin Vassell":   { vsOppPPG:13.5, homeAvg:15.2, awayAvg:13.0, last3avg:14.7, restBoost:false, matchup:"Matchup with OG Anunoby is extremely tough defensively. But Vassell's 42.6% 3PT provides floor. Look for 3PM props when game pace is up." },
};

const REST_DAYS = { 1:3, 2:2, 3:3, 4:2, 5:3, 6:3, 7:2 }; // days rest before each game

function buildPrompt(mode, gameNum, customLegs, numLegs, juiceLevel, betMode, stake) {
  const homeTeam = gameNum<=2 ? "SAS" : "NYK";
  const awayTeam = gameNum<=2 ? "NYK" : "SAS";
  const venue = gameNum<=2 ? "Frost Bank Center, San Antonio" : "Madison Square Garden, New York";
  const restDays = REST_DAYS[gameNum] || 2;

  // Two bet modes: standard (realistic sportsbook odds) and har (fixed-stake lottery payouts)
  const STD = {
    conservative:"target a combined parlay around +200 to +400. Reliable, high-floor legs (70%+ each). Realistic, achievable lines.",
    balanced:"target a combined parlay around +400 to +900. Mix safe anchors with value legs (55-70% each). Solid risk/reward.",
    longshot:"target a combined parlay of +1000 or higher. Ambitious correlated legs (40-58% each). Bold lines, real variance.",
    extreme:"target a combined parlay of +3000 to +12000. Ceiling-game props and unlikely outcomes (25-45% each). Swing for the fences.",
  };
  const HAR = {
    h1:`HAR MODE Tier 1 — bet $${stake} to win roughly $500-$1,000 (about +2400 to +4900 odds). Build a parlay whose combined payout lands a $${stake} stake in the $500-$1,000 range. Ambitious but not absurd — correlated ceiling legs.`,
    h2:`HAR MODE Tier 2 — bet $${stake} to win roughly $1,000-$2,000 (about +4900 to +9900 odds). Bigger swing. Stack confident-but-not-safe legs and one or two long shots.`,
    h3:`HAR MODE Tier 3 — bet $${stake} to win roughly $2,000-$5,000 (about +9900 to +24900 odds). Lottery territory. Aggressive lines, spectacular game-script dependence.`,
    h4:`HAR MODE Tier 4 — bet $${stake} to win $5,000+ (about +24900 odds or higher). Pure moonshot for fun. Maximum legs, boldest lines, everything-breaks-right scenario.`,
  };
  const juiceCtx = betMode==="har" ? (HAR[juiceLevel]||HAR.h1) : (STD[juiceLevel]||STD.balanced);
  const oddsStyle = betMode==="har"
    ? `This is HAR MODE (fun lottery-style). Stake is $${stake}. For each leg give realistic American odds. For the parlay, give combined American odds AND the dollar payout from a $${stake} stake. Lean into big, exciting payouts — these are meant to be long shots for fun.`
    : `This is STANDARD MODE (realistic). For each leg give true-to-life American odds (e.g. -180, +145). For the parlay give realistic combined American odds and the dollar payout from a $${stake} stake.`;

  const pData = Object.entries(GAME_CONTEXT.players).map(([name,p])=>{
    const vo = PLAYER_VS_OPP[name];
    return `${name} (${p.team} | ${p.pos}):
  - Playoff avg: ${p.plyPPG}pts/${p.plyRPG}reb/${p.plyAPG}ast | ${p.plyFGP}%FG | ${p.ply3PP}%3P | ${p.plySPG??"?"}stl/${p.plyBPG??"?"}blk
  - Regular season avg: ${p.regPPG}pts
  - vs This Opponent (H2H): ${vo?.vsOppPPG}pts avg
  - Home avg: ${vo?.homeAvg} | Away avg: ${vo?.awayAvg}
  - Last 3 games avg: ${vo?.last3avg}pts
  - Rest days: ${restDays} (${vo?.restBoost?"better with rest":"neutral on rest"})
  - Matchup: ${vo?.matchup}
  - Trend: ${p.trend}`;
  }).join("\n\n");

  const propList = "Points, Rebounds, Assists, 3-Pointers Made, Pts+Reb+Ast (PRA), Pts+Reb, Pts+Ast, Reb+Ast, Steals, Blocks, Steals+Blocks, Double-Double, Triple-Double, First Basket. You may also suggest ALTERNATE lines (alt props) — a higher line for bigger payout or a lower line for safety, like sportsbooks offer. Mark these by writing 'ALT' in the line text.";

  const base = `You are an elite NBA same-game parlay analyst for the 2026 NBA Finals.

SERIES: ${GAME_CONTEXT.series}
GAME ${gameNum}: ${awayTeam} @ ${homeTeam} at ${venue}
HOME COURT: ${homeTeam} has home court — crowd energy, familiar floor, ref tendencies.
REST: Both teams ${restDays} days rest.

TEAM CONTEXT:
NYK: ${GAME_CONTEXT.nyk.recentForm} | ${GAME_CONTEXT.nyk.playoffPPG} PPG off, ${GAME_CONTEXT.nyk.playoffOPPG} PPG def
SAS: ${GAME_CONTEXT.sas.recentForm} | ${GAME_CONTEXT.sas.playoffPPG} PPG off, ${GAME_CONTEXT.sas.playoffOPPG} PPG def
H2H: ${GAME_CONTEXT.h2h}
KEY MATCHUP: ${GAME_CONTEXT.keyMatchup}
INJURIES: ${GAME_CONTEXT.injuries}

BETTING APPROACH: ${juiceCtx}
ODDS INSTRUCTIONS: ${oddsStyle}

AVAILABLE PROP TYPES: ${propList}

PLAYER DATA:
${pData}

ANALYSIS FACTORS TO WEIGH (think through each):
1. H2H performance vs THIS opponent (data above)
2. Defensive matchup — who guards them, does it help or hurt the prop?
3. Home vs away splits for this venue
4. Recent form (last-3 trend)
5. Rest/fatigue
6. Game number — early Finals games tend more physical/half-court, lower pace
7. PACE & TOTAL — does the projected tempo inflate or suppress counting stats?
8. BLOWOUT RISK — if a blowout is likely, stars sit in the 4th (garbage time caps props)
9. FOUL TROUBLE — bigs (esp. KAT vs Wemby) risk early fouls capping minutes/stats
10. CORRELATION — legs that reinforce each other (a player's scoring + their team winning + a teammate's assists all rise together). Avoid negatively-correlated legs that cannibalize each other.`;

  if(mode==="auto") return `${base}

TASK: Build FOUR complete same-game parlay tickets for Game ${gameNum}, each with EXACTLY ${numLegs} legs. Each ticket is a full, ready-to-bet parlay at a different risk level. Use a VARIETY of prop types across them — defense, combos, 3PM, milestones, not just points. You may reuse strong legs across tickets but each ticket should feel distinct.

The four tickets:
1. "suggested" — the smart balanced play; the best overall mix of safety and upside (this is your recommended ticket)
2. "safe" — highest-probability legs; lowest combined odds; most likely to actually hit
3. "value" — medium risk/reward; a reach beyond safe
4. "longshot" — ambitious, correlated, big combined odds; low probability but huge payout

For EACH ticket provide: combined American odds, the $${stake} dollar payout, and the legs array. Each leg has: player, team, prop, line (use "ALT" prefix for alternate lines), odds (American), and a SHORT one-line reasoning (~12 words max citing the key factor).

Also provide "lockOfNight": the single highest-confidence individual leg across everything (player, team, prop, line, odds, confidence 0-100, and one punchy sentence why) — the "everyone tail this" play.

Also "gameFlow": 2-sentence prediction including expected pace and whether it stays competitive.

Respond ONLY valid JSON, no markdown:
{"gameFlow":"...","lockOfNight":{"player":"...","team":"NYK|SAS","prop":"...","line":"...","odds":"-160","confidence":80,"why":"..."},"tickets":[{"tier":"suggested","odds":"+650","payout":"$${stake} → $X","legs":[{"player":"...","team":"NYK|SAS","prop":"...","line":"...","odds":"+120","reasoning":"..."}]},{"tier":"safe","odds":"...","payout":"...","legs":[...]},{"tier":"value","odds":"...","payout":"...","legs":[...]},{"tier":"longshot","odds":"...","payout":"...","legs":[...]}]}`;

  return `${base}

TASK: Evaluate these ${customLegs.length} parlay legs for Game ${gameNum}. Apply the current betting approach when suggesting adjustments.

USER'S LEGS:
${customLegs.map((l,i)=>`${i+1}. ${l.player} (${GAME_CONTEXT.players[l.player]?.team||"?"}) — ${l.prop} ${l.line}`).join("\n")}

For each leg: odds (American), confidence (0-100), tier (safe 72+/value 58-72/shot <58), reasoning (cite data + pace/blowout/foul/correlation where relevant), risk, adjustment (better line or alt prop if confidence <62, else null).

Assess combined parlay: correlation (does it help or hurt — be specific), combined American odds, the $${stake} dollar payout, recommendation (STRONG BET / WORTH A SHOT / PASS), summary.

Respond ONLY valid JSON:
{"legs":[{"player":"...","prop":"...","line":"...","odds":"+120","confidence":72,"tier":"safe","reasoning":"...","risk":"...","adjustment":null}],"parlayAssessment":{"correlation":"...","estimatedOdds":"+380","payout":"$${stake} → $X","recommendation":"WORTH A SHOT","summary":"..."}}`;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountdown() {
  const [t,setT]=useState({});
  useEffect(()=>{
    const target=new Date("2026-06-04T00:30:00Z");
    const tick=()=>{const diff=target-new Date();if(diff<=0){setT({d:0,h:0,m:0,s:0});return;}setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  return t;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function GoldDivider(){return <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(212,168,67,0.55),transparent)",margin:"4px 0"}}/>;}
function SeriesTracker({nykW,sasW}){return(<div style={{display:"flex",gap:7,justifyContent:"center",alignItems:"center"}}>{[...Array(4)].map((_,i)=><div key={`n${i}`} style={{width:16,height:16,borderRadius:"50%",background:i<nykW?"#006BB6":"transparent",border:"2px solid",borderColor:i<nykW?"#006BB6":"#2A3352",boxShadow:i<nykW?"0 0 10px rgba(0,107,182,0.8)":"none",transition:"all .3s"}}/>)}<div style={{color:"#2A3352",fontSize:9,fontFamily:"monospace",padding:"0 6px"}}>vs</div>{[...Array(4)].map((_,i)=><div key={`s${i}`} style={{width:16,height:16,borderRadius:"50%",background:i<sasW?"#C4CED4":"transparent",border:"2px solid",borderColor:i<sasW?"#C4CED4":"#2A3352",boxShadow:i<sasW?"0 0 8px rgba(196,206,212,0.6)":"none",transition:"all .3s"}}/>)}</div>);}

// ─── FINALS HERO ──────────────────────────────────────────────────────────────
function FinalsHero({nykWins,sasWins}){
  const cd=useCountdown();
  const next=SCHEDULE.find(g=>g.status==="next"||g.status==="scheduled");
  const G="#D4A843", GL="#F5DC80", GD="#9A7A35";
  return(
    <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:14,background:"#000",border:`1px solid ${G}55`,boxShadow:`0 0 70px ${G}1A, inset 0 1px 0 ${G}33`}}>

      {/* Diagonal V split background — NYK blue left, SAS silver right */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        {/* NYK side (left wedge) */}
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:"50%",background:"linear-gradient(135deg,rgba(0,107,182,0.28) 0%,rgba(0,107,182,0.06) 55%,transparent 100%)"}}/>
        {/* SAS side (right wedge) */}
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:"50%",background:"linear-gradient(225deg,rgba(196,206,212,0.16) 0%,rgba(196,206,212,0.04) 55%,transparent 100%)"}}/>
        {/* Center dark V */}
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"42%",height:"100%",background:"linear-gradient(180deg,rgba(0,0,0,0.6),rgba(0,0,0,0.9))"}}/>
        {/* Gold V-frame lines */}
        <div style={{position:"absolute",top:"38%",left:"50%",width:"2px",height:"55%",transform:"translateX(-50%)",background:`linear-gradient(180deg,${G},transparent)`,opacity:0.5}}/>
      </div>

      {/* Skyline silhouette hints */}
      <div style={{position:"absolute",bottom:0,left:0,width:"50%",height:60,pointerEvents:"none",opacity:0.25,
        background:"repeating-linear-gradient(90deg,rgba(0,107,182,0.5) 0px,rgba(0,107,182,0.5) 6px,transparent 6px,transparent 14px,rgba(0,107,182,0.3) 14px,rgba(0,107,182,0.3) 18px,transparent 18px,transparent 28px)",
        WebkitMaskImage:"linear-gradient(180deg,transparent,#000)",maskImage:"linear-gradient(180deg,transparent,#000)"}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:"50%",height:60,pointerEvents:"none",opacity:0.22,
        background:"repeating-linear-gradient(90deg,rgba(196,206,212,0.5) 0px,rgba(196,206,212,0.5) 5px,transparent 5px,transparent 16px,rgba(196,206,212,0.3) 16px,rgba(196,206,212,0.3) 22px,transparent 22px,transparent 30px)",
        WebkitMaskImage:"linear-gradient(180deg,transparent,#000)",maskImage:"linear-gradient(180deg,transparent,#000)"}}/>

      {/* Gold corner accents */}
      <div style={{position:"absolute",top:0,left:0,width:70,height:70,background:`linear-gradient(135deg,${G}40 0%,transparent 60%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:0,right:0,width:70,height:70,background:`linear-gradient(225deg,${G}40 0%,transparent 60%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:0,left:0,width:70,height:70,background:`linear-gradient(45deg,${G}28 0%,transparent 60%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:70,height:70,background:`linear-gradient(315deg,${G}28 0%,transparent 60%)`,pointerEvents:"none"}}/>

      <div style={{position:"relative",padding:"22px 18px 20px",zIndex:1}}>
        {/* Title */}
        <div style={{textAlign:"center",marginBottom:6}}>
          <div style={{fontSize:13,color:GL,letterSpacing:8,fontFamily:"monospace",fontWeight:700,marginBottom:2}}>2026</div>
          <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:50,lineHeight:0.85,background:`linear-gradient(180deg,${GL} 0%,${G} 45%,#7A5A18 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:3}}>FINALS</div>
          <div style={{fontSize:8,color:GD,letterSpacing:4,fontFamily:"monospace",marginTop:4,fontWeight:600}}>★ NEW YORK'S FIRST SINCE 1999 ★</div>
        </div>

        {/* Trophy */}
        <div style={{textAlign:"center",margin:"6px 0 10px"}}>
          <div style={{fontSize:46,lineHeight:1,filter:`drop-shadow(0 0 18px ${G}99)`}}>🏆</div>
        </div>

        {/* Teams — NYK vs SAS with conference labels */}
        <div style={{display:"flex",alignItems:"stretch",justifyContent:"space-between",marginBottom:16,gap:6}}>
          {/* NYK */}
          <div style={{flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}>
            <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",background:"linear-gradient(145deg,rgba(0,107,182,0.3),rgba(0,107,182,0.06))",border:"1px solid rgba(0,107,182,0.5)",borderRadius:12,padding:"12px 16px",marginBottom:8,boxShadow:"0 0 24px rgba(0,107,182,0.2)"}}>
              <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:34,color:"#1A8FE3",textShadow:"0 0 22px rgba(0,107,182,0.7)",letterSpacing:2,lineHeight:1}}>NYK</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#FF8C2A",letterSpacing:3,lineHeight:1.1,marginTop:2}}>KNICKS</div>
            </div>
            <div style={{fontSize:8,color:"#FF8C2A",fontFamily:"monospace",fontWeight:700,letterSpacing:1,lineHeight:1.3}}>EASTERN CONF.<br/>CHAMPIONS</div>
            <div style={{fontSize:8,color:GD,fontFamily:"monospace",marginTop:3}}>#3 · 53–29</div>
          </div>

          {/* VS + score */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,fontFamily:"'Bebas Neue',sans-serif",fontSize:46,lineHeight:1}}>
              <span style={{color:"#F0F4FA",textShadow:"0 0 10px rgba(255,255,255,0.25)"}}>{nykWins}</span>
              <span style={{color:G,fontSize:20}}>–</span>
              <span style={{color:"#F0F4FA",textShadow:"0 0 10px rgba(255,255,255,0.25)"}}>{sasWins}</span>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:G,letterSpacing:3,marginTop:2,textShadow:`0 0 12px ${G}66`}}>VS</div>
            <div style={{fontSize:7,color:GD,fontFamily:"monospace",letterSpacing:2,marginTop:2}}>SERIES</div>
          </div>

          {/* SAS */}
          <div style={{flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}>
            <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",background:"linear-gradient(145deg,rgba(196,206,212,0.16),rgba(196,206,212,0.04))",border:"1px solid rgba(196,206,212,0.35)",borderRadius:12,padding:"12px 16px",marginBottom:8}}>
              <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:34,color:"#D8E4EC",letterSpacing:2,lineHeight:1}}>SAS</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#9AAAB8",letterSpacing:3,lineHeight:1.1,marginTop:2}}>SPURS</div>
            </div>
            <div style={{fontSize:8,color:"#9AAAB8",fontFamily:"monospace",fontWeight:700,letterSpacing:1,lineHeight:1.3}}>WESTERN CONF.<br/>CHAMPIONS</div>
            <div style={{fontSize:8,color:GD,fontFamily:"monospace",marginTop:3}}>#2 · 62–20</div>
          </div>
        </div>

        {/* Series dots */}
        <div style={{marginBottom:14}}><SeriesTracker nykW={nykWins} sasW={sasWins}/></div>

        {/* gold divider */}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${G}66,transparent)`,marginBottom:14}}/>

        {/* Win probability */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:11,color:"#FF8C2A",fontFamily:"monospace",fontWeight:700}}>NYK 35.9%</span>
            <span style={{fontSize:8,color:GD,letterSpacing:2,textTransform:"uppercase",fontFamily:"monospace"}}>Series Win Probability</span>
            <span style={{fontSize:11,color:"#D8E4EC",fontFamily:"monospace",fontWeight:700}}>SAS 64.1%</span>
          </div>
          <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden",border:`1px solid ${G}1A`}}>
            <div style={{height:"100%",width:"35.9%",background:"linear-gradient(90deg,#006BB6,#FF8C2A)",borderRadius:3}}/>
          </div>
        </div>

        {/* NEXT GAME */}
        {next&&(
          <div style={{background:`linear-gradient(135deg,${G}14,rgba(0,107,182,0.08))`,borderRadius:12,padding:"14px 16px",border:`1px solid ${G}33`,marginBottom:14}}>
            <div style={{fontSize:8,color:G,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,textAlign:"center",fontWeight:700}}>◆ NEXT GAME</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#1A8FE3",letterSpacing:2}}>NYK</div><div style={{fontSize:8,color:GD,fontFamily:"monospace"}}>Away</div></div>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:G,letterSpacing:3,textShadow:`0 0 12px ${G}66`}}>GAME {next.game}</div>
                <div style={{fontSize:11,color:"#F0F4FA",fontFamily:"monospace",fontWeight:700,marginTop:2}}>{next.date}</div>
                <div style={{fontSize:10,color:"#FF8C2A",fontFamily:"monospace"}}>{next.time}</div>
              </div>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#D8E4EC",letterSpacing:2}}>SAS</div><div style={{fontSize:8,color:GD,fontFamily:"monospace"}}>Home</div></div>
            </div>
            <div style={{marginTop:10,textAlign:"center",fontSize:9,color:"#B0C0D8",fontFamily:"monospace"}}>✈️ Frost Bank Center, San Antonio</div>
            <div style={{marginTop:6,display:"flex",gap:8,justifyContent:"center"}}>
              <div style={{padding:"3px 10px",borderRadius:4,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",fontSize:9,color:"#F0F4FA",fontFamily:"monospace",letterSpacing:1,fontWeight:600}}>{next.network}</div>
              <div style={{padding:"3px 10px",borderRadius:4,background:`${G}1A`,border:`1px solid ${G}40`,fontSize:9,color:G,fontFamily:"monospace",letterSpacing:1,fontWeight:600}}>ESPN APP</div>
            </div>
          </div>
        )}

        {/* Countdown */}
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,color:GD,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,fontWeight:600}}>Tipoff Countdown</div>
          <div style={{display:"flex",justifyContent:"center",gap:12,alignItems:"flex-start"}}>
            {[["d","Days"],["h","Hrs"],["m","Min"],["s","Sec"]].map(([k,lbl],i,arr)=>(
              <div key={k} style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:38,lineHeight:1,background:`linear-gradient(180deg,${GL},${G})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>{String(cd[k]??0).padStart(2,"0")}</div>
                  <div style={{fontSize:7,color:GD,letterSpacing:3,textTransform:"uppercase",marginTop:2,fontFamily:"monospace"}}>{lbl}</div>
                </div>
                {i<arr.length-1&&<div style={{color:GD,fontSize:32,fontFamily:"'Bebas Neue',sans-serif",lineHeight:1.1,marginTop:2,opacity:0.4}}>:</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── STATS COMPARISON (restored) ──────────────────────────────────────────────
function StatBarH({nv,sv,hib}){const nW=hib?nv>=sv:nv<=sv;return(<div style={{display:"flex",height:3,borderRadius:2,overflow:"hidden",margin:"3px 0 1px",gap:1}}><div style={{flex:nv,background:nW?"#006BB6":"rgba(0,107,182,0.25)",borderRadius:"2px 0 0 2px",transition:"flex 0.6s"}}/><div style={{flex:sv,background:!nW?"#C4CED4":"rgba(196,206,212,0.2)",borderRadius:"0 2px 2px 0",transition:"flex 0.6s"}}/></div>);}

function StatRowH({cat,nv,sv,showRanks}){const fmt=v=>(v===undefined||v===null)?"—":typeof v!=="number"?v:Number.isInteger(v)?v:v.toFixed(1);const hib=cat.higher==="better";const nW=hib?nv>sv:nv<sv;const sW=hib?sv>nv:sv<nv;return(<div style={{padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:64}}><span style={{fontFamily:"monospace",fontSize:15,fontWeight:700,color:nW?C.text:"#4A5A75"}}>{fmt(nv)}</span>{showRanks&&cat.nykRank&&<span style={{fontSize:8,color:C.dim,marginLeft:4,fontFamily:"monospace"}}>({cat.nykRank})</span>}</div><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:12,color:C.gold,fontWeight:700}}>{cat.label}</div><StatBarH nv={nv} sv={sv} hib={hib}/></div><div style={{width:64,textAlign:"right"}}>{showRanks&&cat.sasRank&&<span style={{fontSize:8,color:C.dim,marginRight:4,fontFamily:"monospace"}}>({cat.sasRank})</span>}<span style={{fontFamily:"monospace",fontSize:15,fontWeight:700,color:sW?C.text:"#4A5A75"}}>{fmt(sv)}</span></div></div></div>);}

function StatsComparison(){
  const[view,setView]=useState("regular");
  const data=STATS_DATA[view];
  const views={regular:"Regular Season",playoffs:"NBA Playoffs",h2h:"vs. Opponent"};
  return(
    <div style={{borderRadius:14,background:C.card,border:`1px solid ${C.border}`,padding:"16px",marginBottom:14}}>
      <div style={{fontSize:9,color:C.gold,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,fontWeight:700}}>\u25a6 Team Stats Comparison</div>
      <div style={{display:"flex",gap:3,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:3,marginBottom:10}}>
        {Object.entries(views).map(([k,label])=><button key={k} onClick={()=>setView(k)} style={{flex:1,padding:"6px 3px",borderRadius:6,border:"none",cursor:"pointer",background:view===k?"rgba(0,107,182,0.35)":"transparent",color:view===k?C.nykOrange:C.dim,fontSize:8,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:view===k?700:400,borderBottom:view===k?"1px solid rgba(245,132,38,0.5)":"1px solid transparent",transition:"all 0.2s"}}>{label}</button>)}
      </div>
      {view==="h2h"&&<div style={{marginBottom:10,padding:"6px 10px",borderRadius:6,background:"rgba(245,132,38,0.08)",border:"1px solid rgba(245,132,38,0.15)"}}><div style={{fontSize:9,color:C.gold,fontFamily:"monospace",fontWeight:700,marginBottom:2}}>2 reg. season games + NBA Cup Final</div><div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>Dec 31: SAS 134\u2013132 NYK | Mar 1: NYK 114\u201389 SAS | Cup: NYK 124\u2013113 SAS</div></div>}
      <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
        <div style={{width:64}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:C.nykBlue,letterSpacing:2}}>NYK</div><div style={{fontSize:8,color:C.dim,fontFamily:"monospace"}}>53\u201329</div></div>
        <div style={{flex:1,textAlign:"center",fontSize:9,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{views[view]} \u00b7 Per Game</div>
        <div style={{width:64,textAlign:"right"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:C.sasSilver,letterSpacing:2}}>SAS</div><div style={{fontSize:8,color:C.dim,fontFamily:"monospace",textAlign:"right"}}>62\u201320</div></div>
      </div>
      {STATS_DATA.categories.map(cat=><StatRowH key={cat.key} cat={cat} nv={data.NYK[cat.key]} sv={data.SAS[cat.key]} showRanks={view==="regular"}/>)}
      <div style={{marginTop:10,display:"flex",gap:12,justifyContent:"center"}}>
        {[["#006BB6","NYK edge"],["#C4CED4","SAS edge"]].map(([color,label])=><div key={label} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:color}}/><span style={{fontSize:9,color:C.light,fontFamily:"monospace"}}>{label}</span></div>)}
      </div>
    </div>
  );
}

function HomeTab({nykWins,sasWins}){
  return(
    <div>
      <FinalsHero nykWins={nykWins} sasWins={sasWins}/>
      <div style={{borderRadius:14,background:C.card,border:"1px solid rgba(212,168,67,0.22)",padding:"14px",marginBottom:14}}>
        <div style={{fontSize:9,color:C.gold,letterSpacing:4,textTransform:"uppercase",marginBottom:10,fontFamily:"monospace"}}>📅 Full Series Schedule</div>
        {SCHEDULE.map((g,i)=>{
          const isNext=g.status==="next";const ifNec=g.status==="if-necessary";
          return(<div key={g.game} style={{display:"flex",alignItems:"center",padding:"9px 12px",borderRadius:8,marginBottom:4,background:isNext?"linear-gradient(135deg,rgba(212,168,67,0.18),rgba(0,107,182,0.08))":"rgba(255,255,255,.02)",border:`1px solid ${isNext?"rgba(212,168,67,0.5)":"rgba(255,255,255,.04)"}`,opacity:ifNec?0.5:1,gap:10}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:isNext?C.gold:C.dim,minWidth:28}}>G{g.game}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                <span style={{fontSize:13,color:isNext?C.text:C.light,fontWeight:700,fontFamily:"monospace"}}>{g.date}</span>
                <span style={{fontSize:10,color:isNext?C.nykOrange:C.dim,fontFamily:"monospace"}}>{g.time}</span>
                {ifNec&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:"rgba(255,255,255,.06)",color:C.dim,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace"}}>If Nec.</span>}
                {isNext&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:"rgba(212,168,67,0.3)",color:C.gold,letterSpacing:1,textTransform:"uppercase",fontFamily:"monospace",animation:"pulse 2s infinite"}}>NEXT</span>}
              </div>
              <div style={{fontSize:10,color:C.dim,fontFamily:"monospace"}}>{g.home==="NYK"?"🏠 MSG — New York":"✈️ Frost Bank Center"} · {g.network}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,fontSize:11,fontFamily:"monospace"}}>
              <span style={{color:g.away==="NYK"?C.nykOrange:C.sasSilver}}>{g.away}</span>
              <span style={{color:"#2A3352",fontSize:8}}>@</span>
              <span style={{color:g.home==="NYK"?C.nykOrange:C.sasSilver}}>{g.home}</span>
            </div>
          </div>);
        })}
      </div>
      <StatsComparison/>
    </div>
  );
}

// ─── SCORES TAB ───────────────────────────────────────────────────────────────
const ECF_GAMES=[
  {game:1,date:"May 19",home:"NYK",away:"CLE",status:"final",nykScore:115,sasScore:104,seriesNote:"NYK leads 1-0",quarters:{NYK:[32,28,29,26,115],SAS:[24,26,28,26,104]},leaders:[{name:"J. Brunson",stat:"PTS",val:"29",team:"NYK"},{name:"K-A. Towns",stat:"REB",val:"14",team:"NYK"},{name:"D. Garland",stat:"PTS",val:"24",team:"CLE"}]},
  {game:2,date:"May 21",home:"NYK",away:"CLE",status:"final",nykScore:109,sasScore:93, seriesNote:"NYK leads 2-0",quarters:{NYK:[28,27,30,24,109],SAS:[22,25,24,22,93]}, leaders:[{name:"M. Bridges",stat:"PTS",val:"25",team:"NYK"},{name:"J. Brunson",stat:"AST",val:"9", team:"NYK"},{name:"D. Garland",stat:"PTS",val:"22",team:"CLE"}]},
  {game:3,date:"May 23",home:"CLE",away:"NYK",status:"final",nykScore:121,sasScore:108,seriesNote:"NYK leads 3-0",quarters:{NYK:[30,32,28,31,121],SAS:[26,28,27,27,108]},leaders:[{name:"J. Brunson",stat:"PTS",val:"31",team:"NYK"},{name:"K-A. Towns",stat:"REB",val:"16",team:"NYK"},{name:"E. Mobley",stat:"PTS",val:"22",team:"CLE"}]},
  {game:4,date:"May 25",home:"CLE",away:"NYK",status:"final",nykScore:130,sasScore:93, seriesNote:"NYK wins 4-0",quarters:{NYK:[34,35,31,30,130],SAS:[22,26,23,22,93]}, leaders:[{name:"OG Anunoby",stat:"PTS",val:"28",team:"NYK"},{name:"J. Brunson",stat:"AST",val:"10",team:"NYK"},{name:"D. Garland",stat:"PTS",val:"19",team:"CLE"}]},
];
const FINALS_GAMES=[
  {game:1,date:"Jun 4", time:"8:30 PM ET",home:"SAS",away:"NYK",status:"next",       network:"ABC", awaySeed:3,homeSeed:2},
  {game:2,date:"Jun 6", time:"8:30 PM ET",home:"SAS",away:"NYK",status:"scheduled",  network:"ABC", awaySeed:3,homeSeed:2},
  {game:3,date:"Jun 9", time:"8:30 PM ET",home:"NYK",away:"SAS",status:"scheduled",  network:"ABC", awaySeed:2,homeSeed:3},
  {game:4,date:"Jun 11",time:"8:30 PM ET",home:"NYK",away:"SAS",status:"scheduled",  network:"ESPN",awaySeed:2,homeSeed:3},
  {game:5,date:"Jun 14",time:"8:30 PM ET",home:"SAS",away:"NYK",status:"if-necessary",network:"ABC",awaySeed:3,homeSeed:2},
  {game:6,date:"Jun 17",time:"8:30 PM ET",home:"NYK",away:"SAS",status:"if-necessary",network:"ABC",awaySeed:2,homeSeed:3},
  {game:7,date:"Jun 20",time:"8:30 PM ET",home:"SAS",away:"NYK",status:"if-necessary",network:"ABC",awaySeed:3,homeSeed:2},
];

function GameCard({game,nykWins,sasWins,onClick,isExpanded}){
  const isPlayed=game.status==="final",isLive=game.status==="live",isIfNec=game.status==="if-necessary",isNext=game.status==="next";
  const nykScore=game.nykScore,sasScore=game.sasScore;
  const nykWon=isPlayed&&nykScore>sasScore,sasWon=isPlayed&&sasScore>nykScore;
  return(
    <div style={{borderRadius:12,overflow:"hidden",marginBottom:8,border:`1px solid ${isLive?"rgba(245,132,38,0.5)":isNext?"rgba(212,168,67,0.55)":"rgba(255,255,255,0.06)"}`,background:isLive?"linear-gradient(135deg,rgba(245,132,38,0.08),rgba(0,107,182,0.06))":isNext?"linear-gradient(135deg,rgba(212,168,67,0.10),rgba(0,107,182,0.05))":C.card,cursor:isPlayed?"pointer":"default"}}
      onClick={isPlayed?onClick:undefined}>
      <div style={{display:"flex",alignItems:"center",padding:"10px 14px",gap:10}}>
        <div style={{minWidth:40}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:isLive?C.nykOrange:isNext?C.gold:isPlayed?C.text:C.dim,letterSpacing:1,lineHeight:1}}>G{game.game}</div><div style={{fontSize:8,color:C.dim,fontFamily:"monospace"}}>{game.date}</div></div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:5,height:5,borderRadius:"50%",background:game.away==="NYK"?C.nykBlue:C.sasSilver}}/><span style={{fontSize:13,fontFamily:"monospace",fontWeight:700,color:isPlayed?(game.away==="NYK"?(nykWon?C.text:"#4A5A75"):(sasWon?C.text:"#4A5A75")):C.light}}>{game.away}</span></div>
            {(isPlayed||isLive)&&<span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:isLive?C.nykOrange:game.away==="NYK"?(nykWon?C.text:"#4A5A75"):(sasWon?C.text:"#4A5A75"),letterSpacing:1}}>{game.away==="NYK"?nykScore:sasScore}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:5,height:5,borderRadius:"50%",background:game.home==="NYK"?C.nykBlue:C.sasSilver}}/><span style={{fontSize:13,fontFamily:"monospace",fontWeight:700,color:isPlayed?(game.home==="NYK"?(nykWon?C.text:"#4A5A75"):(sasWon?C.text:"#4A5A75")):C.light}}>{game.home}</span></div>
            {(isPlayed||isLive)&&<span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:isLive?C.nykOrange:game.home==="NYK"?(nykWon?C.text:"#4A5A75"):(sasWon?C.text:"#4A5A75"),letterSpacing:1}}>{game.home==="NYK"?nykScore:sasScore}</span>}
          </div>
        </div>
        <div style={{textAlign:"right",minWidth:72}}>
          {isLive&&<div style={{fontSize:9,color:C.nykOrange,fontFamily:"monospace",animation:"pulse 1.5s infinite"}}>● LIVE</div>}
          {isPlayed&&<div><div style={{fontSize:9,color:nykWon?"#006BB6":C.dim,fontFamily:"monospace",fontWeight:700,marginBottom:2}}>FINAL</div>{game.seriesNote&&<div style={{fontSize:8,color:C.dim,fontFamily:"monospace"}}>{game.seriesNote}</div>}<div style={{fontSize:8,color:"#3A4460",fontFamily:"monospace",marginTop:2}}>Tap for box score</div></div>}
          {isNext&&<div><div style={{fontSize:9,color:C.gold,fontFamily:"monospace",animation:"pulse 2s infinite",marginBottom:2}}>NEXT</div><div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>{game.time}</div><div style={{fontSize:8,color:C.goldDim,fontFamily:"monospace",marginTop:1}}>{game.network}</div></div>}
          {(game.status==="scheduled"||isIfNec)&&<div><div style={{fontSize:9,color:C.dim,fontFamily:"monospace",marginBottom:2}}>{isIfNec?"IF NEC.":"UPCOMING"}</div><div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>{game.time}</div><div style={{fontSize:8,color:"#3A4460",fontFamily:"monospace",marginTop:1}}>{game.network}</div></div>}
        </div>
      </div>
      <div style={{padding:"3px 14px 8px",fontSize:9,color:"#2A3450",fontFamily:"monospace"}}>{game.home==="NYK"?"🏠 Madison Square Garden, New York":"✈️ Frost Bank Center, San Antonio"}</div>
      {isPlayed&&isExpanded&&game.quarters&&(
        <div style={{padding:"10px 14px 12px",borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.25)"}}>
          <div style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Scoring by Quarter</div>
          <div style={{display:"grid",gridTemplateColumns:"50px 1fr 1fr 1fr 1fr 1fr",gap:6,textAlign:"center"}}>
            <div/>{["Q1","Q2","Q3","Q4","FIN"].map(q=><div key={q} style={{fontSize:8,color:C.dim,fontFamily:"monospace"}}>{q}</div>)}
            <div style={{fontSize:10,color:C.nykBlue,fontFamily:"monospace",fontWeight:700,textAlign:"left"}}>NYK</div>
            {game.quarters.NYK.map((v,i)=><div key={i} style={{fontSize:11,fontFamily:"monospace",fontWeight:700,color:i===4?(nykWon?C.text:"#4A5A75"):C.light}}>{v}</div>)}
            <div style={{fontSize:10,color:C.sasSilver,fontFamily:"monospace",fontWeight:700,textAlign:"left"}}>OPP</div>
            {game.quarters.SAS.map((v,i)=><div key={i} style={{fontSize:11,fontFamily:"monospace",fontWeight:700,color:i===4?(sasWon?C.text:"#4A5A75"):C.light}}>{v}</div>)}
          </div>
          {game.leaders&&<div style={{marginTop:12}}><div style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Game Leaders</div><div style={{display:"flex",gap:6}}>{game.leaders.map((l,i)=><div key={i} style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"6px 8px",border:`1px solid ${l.team==="NYK"?"rgba(0,107,182,0.2)":"rgba(196,206,212,0.1)"}`}}><div style={{fontSize:8,color:l.team==="NYK"?C.nykBlue:C.sasSilver,fontFamily:"monospace",letterSpacing:1,marginBottom:2}}>{l.stat}</div><div style={{fontSize:10,color:C.text,fontFamily:"monospace",fontWeight:700}}>{l.val}</div><div style={{fontSize:9,color:C.light,fontFamily:"monospace"}}>{l.name}</div></div>)}</div></div>}
        </div>
      )}
    </div>
  );
}

function ScoresTab({nykWins,sasWins,onGameClick}){
  const[expandedGame,setExpandedGame]=useState(null);
  const[ecfExpanded,setEcfExpanded]=useState(null);
  const[showPath,setShowPath]=useState(false);
  return(
    <div>
      <div style={{borderRadius:14,background:"linear-gradient(135deg,rgba(212,168,67,0.12),rgba(8,12,24,0))",border:"1px solid rgba(212,168,67,0.3)",padding:"16px",marginBottom:14}}>
        <div style={{fontSize:9,color:C.gold,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:12}}>🏆 2026 NBA Finals</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:C.nykBlue,textShadow:"0 0 20px rgba(0,107,182,.4)",lineHeight:1}}>NYK</div><div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>#3 Seed</div></div>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,lineHeight:1,letterSpacing:2}}><span style={{color:C.text}}>{nykWins}</span><span style={{color:"#1A2235",fontSize:20,margin:"0 8px"}}>—</span><span style={{color:C.text}}>{sasWins}</span></div><div style={{fontSize:8,color:C.goldDim,fontFamily:"monospace",letterSpacing:2,marginTop:2}}>BEST OF 7</div></div>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:C.sasSilver,lineHeight:1}}>SAS</div><div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>#2 Seed</div></div>
        </div>
        <SeriesTracker nykW={nykWins} sasW={sasWins}/>
        <div style={{marginTop:12,textAlign:"center",fontSize:10,color:C.dim,fontFamily:"monospace"}}>Game 1 · Wed Jun 4 · 8:30 PM ET · Frost Bank Center</div>
      </div>
      <div style={{fontSize:9,color:C.gold,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>◎ Finals Game Log</div>
      {FINALS_GAMES.map(g=>(
        <div key={g.game} onClick={()=>{if(g.status==="final"){setExpandedGame(p=>p===g.game?null:g.game);onGameClick&&onGameClick(g);}}}>
          <GameCard game={g} nykWins={nykWins} sasWins={sasWins} onClick={()=>setExpandedGame(p=>p===g.game?null:g.game)} isExpanded={expandedGame===g.game}/>
        </div>
      ))}
      <button onClick={()=>setShowPath(p=>!p)} style={{width:"100%",background:"rgba(0,107,182,0.08)",border:"1px solid rgba(0,107,182,0.2)",borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6,marginBottom:showPath?10:0}}>
        <span style={{fontSize:10,color:C.nykBlue,fontFamily:"monospace",letterSpacing:1}}>NYK PLAYOFF PATH TO FINALS</span>
        <span style={{fontSize:12,color:C.nykBlue}}>{showPath?"▲":"▼"}</span>
      </button>
      {showPath&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          {[{round:"R1",opp:"vs ATL",result:"W 4-2"},{round:"R2",opp:"vs PHI",result:"W 4-0"},{round:"ECF",opp:"vs CLE",result:"W 4-0",gold:true}].map(r=>(
            <div key={r.round} style={{borderRadius:8,background:C.card,border:`1px solid ${r.gold?"rgba(212,168,67,0.35)":"rgba(0,107,182,0.2)"}`,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:2,marginBottom:4}}>{r.round}</div>
              <div style={{fontSize:10,color:C.text,fontFamily:"monospace",marginBottom:3}}>{r.opp}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:r.gold?C.gold:C.nykBlue}}>{r.result}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:9,color:C.gold,letterSpacing:4,textTransform:"uppercase",fontFamily:"monospace",marginBottom:8}}>ECF vs Cleveland · NYK Won 4-0</div>
        {ECF_GAMES.map(g=><GameCard key={`ecf${g.game}`} game={g} nykWins={4} sasWins={0} onClick={()=>setEcfExpanded(p=>p===g.game?null:g.game)} isExpanded={ecfExpanded===g.game}/>)}
        <div style={{borderRadius:10,background:C.card,border:`1px solid ${C.border}`,padding:"12px 14px",marginTop:4}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>ECF Series Averages</div>
          {[{name:"Jalen Brunson",ppg:28.5,rpg:3.8,apg:9.2},{name:"Karl-A. Towns",ppg:18.8,rpg:13.1,apg:3.0},{name:"Mikal Bridges",ppg:19.2,rpg:5.1,apg:2.8},{name:"OG Anunoby",ppg:14.5,rpg:5.8,apg:2.2}].map(p=>(
            <div key={p.name} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.nykBlue,flexShrink:0}}/>
              <div style={{flex:1,fontSize:11,color:C.text,fontFamily:"monospace"}}>{p.name}</div>
              <div style={{display:"flex",gap:12}}>
                {[["PTS",p.ppg],["REB",p.rpg],["AST",p.apg]].map(([label,val])=>(
                  <div key={label} style={{textAlign:"center"}}><div style={{fontSize:12,fontFamily:"monospace",fontWeight:700,color:C.nykOrange}}>{val}</div><div style={{fontSize:7,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>{label}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>}
      <div style={{borderRadius:10,background:"rgba(255,200,0,0.04)",border:"1px solid rgba(255,200,0,0.12)",padding:"10px 14px",marginTop:10}}>
        <div style={{fontSize:9,color:"#C8A800",fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>🩹 Injury Report</div>
        <div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>No significant injuries heading into Game 1. Mitchell Robinson (broken pinkie) expected to play. OG Anunoby hamstring monitored.</div>
      </div>
    </div>
  );
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
const STAT_VIEWS={reg:"Regular Season",ply:"Playoffs"};

function GameLogTable({log,team}){
  const accent=team==="NYK"?C.nykBlue:C.sasSilver;
  return(
    <div style={{overflowX:"auto",marginTop:10}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,fontFamily:"monospace"}}>
        <thead>
          <tr>{["G","OPP","R","PTS","REB","AST","STL","BLK","FG","3P","MIN"].map(h=>(
            <th key={h} style={{padding:"4px 5px",color:C.dim,fontWeight:600,textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.08)",whiteSpace:"nowrap",letterSpacing:0.5}}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {log.map((row,i)=>(
            <tr key={i} style={{background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
              <td style={{padding:"4px 5px",color:C.dim,textAlign:"center"}}>{row.g}</td>
              <td style={{padding:"4px 5px",color:C.light,textAlign:"center",fontWeight:600}}>{row.opp}</td>
              <td style={{padding:"4px 5px",color:row.res==="W"?"#22C55E":"#EF4444",textAlign:"center",fontWeight:700}}>{row.res}</td>
              <td style={{padding:"4px 5px",color:row.pts>=25?accent:C.text,textAlign:"center",fontWeight:row.pts>=25?700:400}}>{row.pts}</td>
              <td style={{padding:"4px 5px",color:row.reb>=10?accent:C.text,textAlign:"center",fontWeight:row.reb>=10?700:400}}>{row.reb}</td>
              <td style={{padding:"4px 5px",color:row.ast>=8?accent:C.text,textAlign:"center",fontWeight:row.ast>=8?700:400}}>{row.ast}</td>
              <td style={{padding:"4px 5px",color:C.text,textAlign:"center"}}>{row.stl}</td>
              <td style={{padding:"4px 5px",color:C.text,textAlign:"center"}}>{row.blk}</td>
              <td style={{padding:"4px 5px",color:C.mid,textAlign:"center"}}>{row.fgm}/{row.fga}</td>
              <td style={{padding:"4px 5px",color:C.mid,textAlign:"center"}}>{row.tpm}/{row.tpa}</td>
              <td style={{padding:"4px 5px",color:C.dim,textAlign:"center"}}>{row.min}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlayerCard({player,team,statView}){
  const[open,setOpen]=useState(false);
  const[showLog,setShowLog]=useState(false);
  const stats=player[statView];
  const accent=team==="NYK"?C.nykBlue:C.sasSilver;
  const fmt=v=>(v===undefined||v===null)?"—":typeof v!=="number"?v:Number.isInteger(v)?v:v.toFixed(1);
  return(
    <div style={{borderRadius:10,background:C.card,border:`1px solid ${open?`${accent}55`:"rgba(255,255,255,0.05)"}`,marginBottom:6,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",padding:"10px 12px",gap:10,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{width:28,height:28,borderRadius:6,background:`${accent}22`,border:`1px solid ${accent}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:10,fontFamily:"monospace",fontWeight:700,color:accent}}>#{player.jersey}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:1}}>{player.name}</div>
          <div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>{player.pos} · {player.role}</div>
        </div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          {[["PTS",stats?.ppg],["REB",stats?.rpg],["AST",stats?.apg]].map(([lbl,val])=>(
            <div key={lbl} style={{textAlign:"center"}}>
              <div style={{fontSize:14,fontFamily:"monospace",fontWeight:700,color:lbl==="PTS"?accent:C.light}}>{fmt(val)}</div>
              <div style={{fontSize:7,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>{lbl}</div>
            </div>
          ))}
          <span style={{fontSize:10,color:C.dim}}>{open?"▲":"▼"}</span>
        </div>
      </div>
      {open&&(
        <div style={{padding:"0 12px 12px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,marginBottom:10}}>
            {[["STL",stats?.spg],["BLK",stats?.bpg],["FG%",stats?.fgp],["3P%",stats?.tpp]].map(([lbl,val])=>(
              <div key={lbl} style={{textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"6px 4px"}}>
                <div style={{fontSize:13,fontFamily:"monospace",fontWeight:700,color:C.text}}>{fmt(val)}</div>
                <div style={{fontSize:7,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[["FT%",stats?.ftp],["TOV",stats?.tov],["MIN","~34"]].map(([lbl,val])=>(
              <div key={lbl} style={{textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"6px 4px"}}>
                <div style={{fontSize:13,fontFamily:"monospace",fontWeight:700,color:C.text}}>{fmt(val)}</div>
                <div style={{fontSize:7,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"6px 8px",borderRadius:6,background:`${accent}11`,border:`1px solid ${accent}22`,marginBottom:8}}>
            <div style={{fontSize:9,color:accent,fontFamily:"monospace"}}>📌 {player.note}</div>
          </div>
          {player.log&&(
            <button onClick={e=>{e.stopPropagation();setShowLog(s=>!s);}} style={{width:"100%",background:`${accent}11`,border:`1px solid ${accent}33`,borderRadius:7,padding:"7px",cursor:"pointer",color:accent,fontSize:9,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
              {showLog?"▲ Hide":"▼ View"} Playoff Game Log ({player.log.length}G)
            </button>
          )}
          {showLog&&player.log&&<GameLogTable log={player.log} team={team}/>}
        </div>
      )}
    </div>
  );
}

function MatchupCard({matchup}){
  const[open,setOpen]=useState(false);
  const edgeColor=matchup.edge==="NYK"?C.nykBlue:matchup.edge==="SAS"?C.sasSilver:C.gold;
  const findP=(nm,arr)=>arr.find(p=>p.name===nm);
  const np=findP(matchup.nyk.name,NYK_PLAYERS), sp=findP(matchup.sas.name,SAS_PLAYERS);
  const np_=np?.ply, sp_=sp?.ply;
  const fmt=v=>(v===undefined||v===null)?"—":Number.isInteger(v)?v:v.toFixed(1);
  return(
    <div onClick={()=>setOpen(o=>!o)} style={{borderRadius:10,background:open?"rgba(212,168,67,0.05)":C.card,border:`1px solid ${open?"rgba(212,168,67,0.25)":"rgba(255,255,255,0.06)"}`,padding:"12px 14px",marginBottom:8,cursor:"pointer",transition:"all 0.2s"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:9,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{matchup.label}</div>
        <div style={{fontSize:8,padding:"2px 8px",borderRadius:4,background:`${edgeColor}22`,color:edgeColor,fontFamily:"monospace",fontWeight:700,letterSpacing:1}}>{matchup.edge==="Even"?"EVEN MATCHUP":`${matchup.edge} EDGE`}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <div style={{flex:1,textAlign:"center",padding:"8px",borderRadius:8,background:"rgba(0,107,182,0.08)",border:"1px solid rgba(0,107,182,0.15)"}}><div style={{fontSize:9,color:C.nykBlue,fontFamily:"monospace",marginBottom:2}}>{matchup.nyk.pos}</div><div style={{fontSize:12,color:C.text,fontWeight:700}}>{matchup.nyk.name}</div></div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:C.gold,letterSpacing:2}}>VS</div>
        <div style={{flex:1,textAlign:"center",padding:"8px",borderRadius:8,background:"rgba(196,206,212,0.06)",border:"1px solid rgba(196,206,212,0.12)"}}><div style={{fontSize:9,color:C.sasSilver,fontFamily:"monospace",marginBottom:2}}>{matchup.sas.pos}</div><div style={{fontSize:12,color:C.text,fontWeight:700}}>{matchup.sas.name}</div></div>
      </div>
      <div style={{fontSize:10,color:C.light,lineHeight:1.6}}>{matchup.summary}</div>
      {open&&np_&&sp_&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:8,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>Playoff Averages · Head-to-Head</div>
          {[["PTS","ppg"],["REB","rpg"],["AST","apg"],["FG%","fgp"],["3P%","tpp"]].map(([lbl,key])=>{
            const nv=np_[key],sv=sp_[key],nW=nv>=sv;
            return(
              <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"3px 0"}}>
                <span style={{fontSize:12,fontFamily:"monospace",fontWeight:800,color:nW?C.nykBlue:"#5A6A85",width:50}}>{fmt(nv)}{key.includes("p")&&key!=="ppg"&&key!=="apg"&&key!=="rpg"?"%":""}</span>
                <span style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>{lbl}</span>
                <span style={{fontSize:12,fontFamily:"monospace",fontWeight:800,color:!nW?C.sasSilver:"#5A6A85",width:50,textAlign:"right"}}>{fmt(sv)}{key.includes("p")&&key!=="ppg"&&key!=="apg"&&key!=="rpg"?"%":""}</span>
              </div>
            );
          })}
        </div>
      )}
      <div style={{marginTop:8,textAlign:"center",fontSize:8,color:C.dim,fontFamily:"monospace"}}>{open?"▲ tap to collapse":"▼ tap for head-to-head stats"}</div>
    </div>
  );
}

function CompareStatBar({label,nv,sv,hib=true,fmt}){
  const nW=hib?nv>=sv:nv<=sv;
  const max=Math.max(nv,sv)||1;
  return(
    <div style={{marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
        <span style={{fontSize:13,fontFamily:"monospace",fontWeight:800,color:nW?C.nykBlue:"#5A6A85"}}>{fmt?fmt(nv):nv}</span>
        <span style={{fontSize:9,color:C.gold,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>{label}</span>
        <span style={{fontSize:13,fontFamily:"monospace",fontWeight:800,color:!nW?C.sasSilver:"#5A6A85"}}>{fmt?fmt(sv):sv}</span>
      </div>
      <div style={{display:"flex",height:6,gap:2}}>
        <div style={{flex:1,display:"flex",justifyContent:"flex-end",background:"rgba(255,255,255,0.04)",borderRadius:"3px 0 0 3px",overflow:"hidden"}}>
          <div style={{width:`${(nv/max)*100}%`,background:nW?"linear-gradient(90deg,rgba(0,107,182,0.3),#1A8FE3)":"rgba(0,107,182,0.25)",borderRadius:"3px 0 0 3px",transition:"width 0.6s"}}/>
        </div>
        <div style={{flex:1,display:"flex",justifyContent:"flex-start",background:"rgba(255,255,255,0.04)",borderRadius:"0 3px 3px 0",overflow:"hidden"}}>
          <div style={{width:`${(sv/max)*100}%`,background:!nW?"linear-gradient(90deg,#C4CED4,rgba(196,206,212,0.3))":"rgba(196,206,212,0.2)",borderRadius:"0 3px 3px 0",transition:"width 0.6s"}}/>
        </div>
      </div>
    </div>
  );
}

function PlayerCompare({statView}){
  const allNYK=NYK_PLAYERS.map(p=>({...p,team:"NYK"}));
  const allSAS=SAS_PLAYERS.map(p=>({...p,team:"SAS"}));
  const all=[...allNYK,...allSAS];
  const[p1,setP1]=useState("Jalen Brunson");
  const[p2,setP2]=useState("V. Wembanyama");
  const pa=all.find(p=>p.name===p1),pb=all.find(p=>p.name===p2);
  const sa=pa?.[statView],sb=pb?.[statView];
  const fmt1=v=>(v===undefined||v===null)?"—":Number.isInteger(v)?v:v.toFixed(1);
  const fmtP=v=>(v===undefined||v===null)?"—":v.toFixed(1)+"%";
  return(
    <div>
      <div style={{borderRadius:10,background:"rgba(212,168,67,0.05)",border:"1px solid rgba(212,168,67,0.18)",padding:"10px 14px",marginBottom:12}}>
        <div style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:3}}>⚔ Head-to-Head Compare</div>
        <div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>Pick any two players to overlay their {statView==="ply"?"playoff":"regular season"} numbers.</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <select value={p1} onChange={e=>setP1(e.target.value)} style={{flex:1,background:"rgba(0,107,182,0.12)",border:"1px solid rgba(0,107,182,0.35)",borderRadius:8,color:C.text,fontSize:11,padding:"9px 8px",fontFamily:"monospace",outline:"none",fontWeight:700}}>
          <optgroup label="— NYK —" style={{background:"#080808"}}>{allNYK.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</optgroup>
          <optgroup label="— SAS —" style={{background:"#080808"}}>{allSAS.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</optgroup>
        </select>
        <div style={{display:"flex",alignItems:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:C.gold,letterSpacing:1}}>VS</div>
        <select value={p2} onChange={e=>setP2(e.target.value)} style={{flex:1,background:"rgba(196,206,212,0.08)",border:"1px solid rgba(196,206,212,0.3)",borderRadius:8,color:C.text,fontSize:11,padding:"9px 8px",fontFamily:"monospace",outline:"none",fontWeight:700}}>
          <optgroup label="— NYK —" style={{background:"#080808"}}>{allNYK.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</optgroup>
          <optgroup label="— SAS —" style={{background:"#080808"}}>{allSAS.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</optgroup>
        </select>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
        <div style={{flex:1}}><div style={{fontSize:13,color:C.nykBlue,fontWeight:800}}>{pa?.name}</div><div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>{pa?.team} · {pa?.pos} · #{pa?.jersey}</div></div>
        <div style={{flex:1,textAlign:"right"}}><div style={{fontSize:13,color:C.sasSilver,fontWeight:800}}>{pb?.name}</div><div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>{pb?.team} · {pb?.pos} · #{pb?.jersey}</div></div>
      </div>
      {sa&&sb&&<div style={{borderRadius:12,background:C.card,border:`1px solid ${C.border}`,padding:"14px 16px"}}>
        <CompareStatBar label="Points" nv={sa.ppg} sv={sb.ppg} fmt={fmt1}/>
        <CompareStatBar label="Rebounds" nv={sa.rpg} sv={sb.rpg} fmt={fmt1}/>
        <CompareStatBar label="Assists" nv={sa.apg} sv={sb.apg} fmt={fmt1}/>
        <CompareStatBar label="Steals" nv={sa.spg} sv={sb.spg} fmt={fmt1}/>
        <CompareStatBar label="Blocks" nv={sa.bpg} sv={sb.bpg} fmt={fmt1}/>
        <CompareStatBar label="FG%" nv={sa.fgp} sv={sb.fgp} fmt={fmtP}/>
        <CompareStatBar label="3PT%" nv={sa.tpp} sv={sb.tpp} fmt={fmtP}/>
        <CompareStatBar label="FT%" nv={sa.ftp} sv={sb.ftp} fmt={fmtP}/>
        <CompareStatBar label="Turnovers" nv={sa.tov} sv={sb.tov} hib={false} fmt={fmt1}/>
        <div style={{marginTop:10,display:"flex",gap:12,justifyContent:"center"}}>
          {[[C.nykBlue,pa?.name],[C.sasSilver,pb?.name]].map(([color,nm])=><div key={nm} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:color}}/><span style={{fontSize:9,color:C.light,fontFamily:"monospace"}}>{nm}</span></div>)}
        </div>
      </div>}
    </div>
  );
}

function StatsTab({initialGame}){
  const[team,setTeam]=useState("both");
  const[statView,setStatView]=useState("ply");
  const[section,setSection]=useState(initialGame?"matchups":"players");
  return(
    <div>
      <div style={{display:"flex",gap:4,background:"rgba(0,0,0,0.35)",borderRadius:10,padding:4,marginBottom:14}}>
        {[{id:"players",label:"Players"},{id:"compare",label:"Compare"},{id:"matchups",label:"Matchups"}].map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:section===s.id?"rgba(0,107,182,0.3)":"transparent",color:section===s.id?C.nykOrange:C.dim,fontSize:10,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:section===s.id?700:400,transition:"all 0.2s"}}>{s.label}</button>
        ))}
      </div>
      {section==="players"&&<div>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          <div style={{display:"flex",gap:3,background:"rgba(0,0,0,0.35)",borderRadius:8,padding:3,flex:1}}>
            {[["both","Both"],["NYK","NYK"],["SAS","SAS"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>setTeam(k)} style={{flex:1,padding:"5px 4px",borderRadius:6,border:"none",cursor:"pointer",background:team===k?(k==="NYK"?"rgba(0,107,182,0.4)":k==="SAS"?"rgba(196,206,212,0.15)":"rgba(255,255,255,0.08)"):"transparent",color:team===k?(k==="NYK"?C.nykBlue:k==="SAS"?C.sasSilver:C.text):C.dim,fontSize:9,fontFamily:"monospace",fontWeight:team===k?700:400,transition:"all 0.2s"}}>{lbl}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:3,background:"rgba(0,0,0,0.35)",borderRadius:8,padding:3}}>
            {Object.entries(STAT_VIEWS).map(([k,lbl])=>(
              <button key={k} onClick={()=>setStatView(k)} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",background:statView===k?"rgba(245,132,38,0.2)":"transparent",color:statView===k?C.nykOrange:C.dim,fontSize:9,fontFamily:"monospace",fontWeight:statView===k?700:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{fontSize:9,color:C.dim,fontFamily:"monospace",marginBottom:8}}>Tap player to expand · tap "Game Log" for playoff game-by-game</div>
        {(team==="both"||team==="NYK")&&<div style={{marginBottom:team==="both"?16:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,marginTop:4}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.nykBlue,letterSpacing:2}}>NEW YORK KNICKS</div>
            <div style={{height:1,flex:1,background:"rgba(0,107,182,0.2)"}}/>
            <div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>53–29</div>
          </div>
          {NYK_PLAYERS.map(p=><PlayerCard key={p.name} player={p} team="NYK" statView={statView}/>)}
        </div>}
        {(team==="both"||team==="SAS")&&<div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,marginTop:team==="both"?4:8}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.sasSilver,letterSpacing:2}}>SAN ANTONIO SPURS</div>
            <div style={{height:1,flex:1,background:"rgba(196,206,212,0.15)"}}/>
            <div style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>62–20</div>
          </div>
          {SAS_PLAYERS.map(p=><PlayerCard key={p.name} player={p} team="SAS" statView={statView}/>)}
        </div>}
      </div>}
      {section==="compare"&&<div>
        <div style={{display:"flex",gap:3,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:3,marginBottom:14,width:"fit-content"}}>
          {Object.entries(STAT_VIEWS).map(([k,lbl])=>(
            <button key={k} onClick={()=>setStatView(k)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",background:statView===k?"rgba(245,132,38,0.2)":"transparent",color:statView===k?C.nykOrange:C.dim,fontSize:9,fontFamily:"monospace",fontWeight:statView===k?700:400,whiteSpace:"nowrap"}}>{lbl}</button>
          ))}
        </div>
        <PlayerCompare statView={statView}/>
      </div>}
      {section==="matchups"&&<div>
        <div style={{borderRadius:10,background:"rgba(212,168,67,0.07)",border:"1px solid rgba(212,168,67,0.22)",padding:"10px 14px",marginBottom:12}}>
          <div style={{fontSize:9,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Key Matchups · 2026 Finals</div>
          <div style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>The 1999 Finals rematch. A dynasty in the making vs a city waiting 53 years.</div>
        </div>
        {MATCHUPS.map((m,i)=><MatchupCard key={i} matchup={m}/>)}
        <div style={{borderRadius:10,background:C.card,border:`1px solid ${C.border}`,padding:"12px 14px",marginTop:4}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>Series Storylines</div>
          {[{icon:"🔥",title:"Knicks' historic run",body:"11-0, +23.8 PPG margin — most dominant run in NBA Finals history."},{icon:"👶",title:"Spurs' youth movement",body:"Starting lineup avg 22.4 yrs old — youngest in Conference Finals history."},{icon:"🕰️",title:"1999 rematch",body:"Last time these teams met in the Finals, Tim Duncan's Spurs won in 5. Now Wemby steps in."},{icon:"💪",title:"Wemby vs The World",body:"28.2 PPG in playoffs. If he's the best player on the floor for 4 games, SAS wins."}].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <span style={{fontSize:16,flexShrink:0}}>{s.icon}</span>
              <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:2}}>{s.title}</div><div style={{fontSize:10,color:C.light,lineHeight:1.6}}>{s.body}</div></div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

// ─── PICKS TAB ────────────────────────────────────────────────────────────────
function ConfidenceMeter({pct}){
  const color=pct>=72?"#22C55E":pct>=58?"#F59E0B":"#EF4444";
  return(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:2,transition:"width 0.8s ease"}}/></div><span style={{fontSize:12,fontFamily:"monospace",fontWeight:700,color,minWidth:36}}>{pct}%</span></div>);
}

function TierBadge({tier}){
  const t=TIER_CFG[tier]||TIER_CFG.value;
  return(<span style={{fontSize:8,padding:"2px 7px",borderRadius:4,background:t.bg,color:t.color,border:`1px solid ${t.border}`,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>{t.label}</span>);
}

function PickCard({pick}){
  const[open,setOpen]=useState(false);
  const isNYK=pick.team==="NYK";
  const teamColor=isNYK?C.nykBlue:C.sasSilver;
  const t=TIER_CFG[pick.tier]||TIER_CFG.value;
  return(
    <div onClick={()=>setOpen(o=>!o)} style={{borderRadius:10,border:`1px solid ${open?t.border:"rgba(255,255,255,0.07)"}`,background:open?t.bg:"rgba(255,255,255,0.02)",marginBottom:6,cursor:"pointer",overflow:"hidden",transition:"all 0.2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px"}}>
        <div style={{width:28,height:28,borderRadius:6,background:`${teamColor}22`,border:`1px solid ${teamColor}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:teamColor}}>{pick.team}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:C.text}}>{pick.player}</span><TierBadge tier={pick.tier}/>{pick.line&&pick.line.toUpperCase().includes("ALT")&&<span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:"rgba(245,132,38,0.18)",color:C.nykOrange,fontFamily:"monospace",fontWeight:700,letterSpacing:1}}>ALT</span>}</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{pick.line}</span>
            {pick.odds&&<span style={{fontSize:10,color:C.gold,fontFamily:"monospace",fontWeight:800}}>{pick.odds}</span>}
          </div>
        </div>
        <div style={{textAlign:"right"}}><div style={{fontSize:18,fontFamily:"monospace",fontWeight:700,color:t.color}}>{pick.confidence}%</div><div style={{fontSize:8,color:C.dim,fontFamily:"monospace"}}>CONF</div></div>
      </div>
      {open&&(
        <div style={{padding:"0 12px 12px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{marginTop:10,marginBottom:8}}><ConfidenceMeter pct={pick.confidence}/></div>
          <div style={{fontSize:10,color:C.light,lineHeight:1.6,marginBottom:8}}>{pick.reasoning}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:pick.adjustment?8:0}}><span style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>RISK:</span><span style={{fontSize:10,color:C.light,fontFamily:"monospace"}}>{pick.risk}</span></div>
          {pick.adjustment&&<div style={{padding:"6px 8px",borderRadius:6,background:"rgba(212,168,67,0.12)",border:"1px solid rgba(212,168,67,0.3)"}}><span style={{fontSize:8,color:C.gold,fontFamily:"monospace",letterSpacing:1}}>💡 ALT: </span><span style={{fontSize:9,color:C.light,fontFamily:"monospace"}}>{pick.adjustment}</span></div>}
        </div>
      )}
    </div>
  );
}

function LockOfNight({lock}){
  if(!lock)return null;
  const teamColor=lock.team==="NYK"?C.nykBlue:C.sasSilver;
  return(
    <div style={{borderRadius:12,overflow:"hidden",marginBottom:16,background:"linear-gradient(135deg,rgba(245,132,38,0.18),rgba(212,168,67,0.08))",border:"1px solid rgba(245,132,38,0.5)",boxShadow:"0 0 24px rgba(245,132,38,0.15)"}}>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:10,color:C.nykOrange,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",fontWeight:800}}>🔥 Lock of the Night</div>
          <span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:`${teamColor}22`,color:teamColor,fontFamily:"monospace",fontWeight:700}}>{lock.team}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <div><div style={{fontSize:15,fontWeight:800,color:C.text}}>{lock.player}</div><div style={{fontSize:11,color:C.light,fontFamily:"monospace",marginTop:1}}>{lock.line} <span style={{color:C.gold,fontWeight:800}}>{lock.odds}</span></div></div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:C.nykOrange,letterSpacing:1}}>{lock.confidence}%</div><div style={{fontSize:7,color:C.goldDim,fontFamily:"monospace",letterSpacing:1}}>CONFIDENCE</div></div>
        </div>
        <div style={{fontSize:10,color:C.light,lineHeight:1.5,fontStyle:"italic"}}>{lock.why}</div>
      </div>
    </div>
  );
}

function ParlayTicket({ticket,stake,onCopy,copiedTier}){
  const[open,setOpen]=useState(ticket.tier==="suggested");
  const t=TIER_CFG[ticket.tier]||TIER_CFG.value;
  const isCopied=copiedTier===ticket.tier;
  return(
    <div style={{borderRadius:12,overflow:"hidden",marginBottom:10,background:open?t.bg:"rgba(255,255,255,0.02)",border:`1px solid ${t.border}`,boxShadow:ticket.tier==="suggested"?`0 0 18px ${t.color}1F`:"none",transition:"all 0.2s"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"monospace",fontSize:12,fontWeight:800,color:t.color,letterSpacing:1,textTransform:"uppercase"}}>{t.label}</div>
          <div style={{fontSize:9,color:C.mid,fontFamily:"monospace",marginTop:2}}>{ticket.legs?.length||0} legs · tap to {open?"hide":"see"} picks</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:t.color,letterSpacing:1}}>{ticket.odds}</div>
          <div style={{fontSize:9,color:"#22C55E",fontFamily:"monospace",fontWeight:700}}>{ticket.payout}</div>
        </div>
      </div>
      {open&&(
        <div style={{padding:"0 16px 14px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
            {(ticket.legs||[]).map((leg,i)=>{
              const tc=leg.team==="NYK"?C.nykBlue:C.sasSilver;
              const isAlt=leg.line&&leg.line.toUpperCase().includes("ALT");
              return(
                <div key={i} style={{padding:"8px 10px",borderRadius:7,background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontSize:8,fontFamily:"monospace",fontWeight:700,color:tc,minWidth:26}}>{leg.team}</span>
                    <span style={{fontSize:11,color:C.text,fontWeight:700,flex:1}}>{leg.player}</span>
                    {isAlt&&<span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:"rgba(245,132,38,0.18)",color:C.nykOrange,fontFamily:"monospace",fontWeight:700}}>ALT</span>}
                    <span style={{fontSize:11,color:C.gold,fontFamily:"monospace",fontWeight:800}}>{leg.odds}</span>
                  </div>
                  <div style={{fontSize:10,color:C.light,fontFamily:"monospace",marginBottom:leg.reasoning?3:0}}>{leg.line} {leg.prop}</div>
                  {leg.reasoning&&<div style={{fontSize:9,color:C.mid,lineHeight:1.4,fontStyle:"italic"}}>{leg.reasoning}</div>}
                </div>
              );
            })}
          </div>
          <button onClick={()=>onCopy(ticket)} style={{width:"100%",padding:"9px",borderRadius:7,border:`1px solid ${t.color}55`,background:isCopied?"rgba(34,197,94,0.15)":`${t.color}12`,color:isCopied?"#22C55E":t.color,fontSize:10,fontFamily:"monospace",letterSpacing:1,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>{isCopied?"✓ COPIED — PASTE IN GROUP CHAT":"📋 COPY THIS TICKET"}</button>
        </div>
      )}
    </div>
  );
}

function ParlayAssessment({assessment}){
  const recColor=assessment.recommendation==="STRONG BET"?"#22C55E":assessment.recommendation==="WORTH A SHOT"?"#F59E0B":"#EF4444";
  return(
    <div style={{borderRadius:12,background:C.card,border:"1px solid rgba(255,255,255,0.08)",padding:"14px 16px",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{fontSize:9,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace"}}>Parlay Assessment</div>
        <span style={{fontSize:9,padding:"3px 10px",borderRadius:5,fontFamily:"monospace",fontWeight:700,letterSpacing:1,background:`${recColor}22`,color:recColor,border:`1px solid ${recColor}44`}}>{assessment.recommendation}</span>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{flex:1,textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.gold,letterSpacing:2}}>{assessment.estimatedOdds}</div><div style={{fontSize:7,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>EST. ODDS</div></div>
        <div style={{flex:2,background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px"}}><div style={{fontSize:8,color:C.dim,fontFamily:"monospace",letterSpacing:1,marginBottom:4}}>CORRELATION</div><div style={{fontSize:10,color:C.light,lineHeight:1.5}}>{assessment.correlation}</div></div>
      </div>
      <div style={{fontSize:10,color:C.light,lineHeight:1.6}}>{assessment.summary}</div>
      {assessment.payout&&<div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",textAlign:"center"}}><span style={{fontSize:9,color:"#22C55E",fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase"}}>💰 Potential Payout: </span><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#22C55E",letterSpacing:1}}>{assessment.payout}</span></div>}
    </div>
  );
}



function PicksTab(){
  const[mode,setMode]=useState("auto");
  const[betMode,setBetMode]=useState("standard");
  const[stake,setStake]=useState(20);
  const[gameNum,setGameNum]=useState(1);
  const[numLegs,setNumLegs]=useState(4);
  const[juiceLevel,setJuiceLevel]=useState("balanced");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const[error,setError]=useState(null);
  const[gameFlow,setGameFlow]=useState(null);
  const[copied,setCopied]=useState(false);
  const[copiedTier,setCopiedTier]=useState(null);
  const[customLegs,setCustomLegs]=useState([
    {player:"Jalen Brunson",prop:"Points",line:"Over 26.5"},
    {player:"V. Wembanyama",prop:"Rebounds",line:"Over 11.5"},
  ]);

  // When switching bet mode, reset juice to that mode's first tier
  const switchBetMode=(m)=>{setBetMode(m);setJuiceLevel(m==="har"?"h1":"balanced");setResult(null);};

  const addLeg=()=>{if(customLegs.length>=20)return;setCustomLegs(p=>[...p,{player:"Jalen Brunson",prop:"Points",line:"Over 24.5"}]);};
  const removeLeg=i=>setCustomLegs(p=>p.filter((_,idx)=>idx!==i));
  const updateLeg=(i,field,val)=>setCustomLegs(p=>p.map((l,idx)=>idx===i?{...l,[field]:val}:l));

  const analyze=async()=>{
    setLoading(true);setResult(null);setError(null);setGameFlow(null);
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:buildPrompt(mode,gameNum,customLegs,numLegs,juiceLevel,betMode,stake)})});
      const data=await res.json();
      const raw=data.content?.map(b=>b.text||"").join("").trim()||"";
      let clean=raw.replace(/```json|```/g,"").trim();
      // Extract the JSON object even if the model wrapped it in stray text
      const first=clean.indexOf("{"), last=clean.lastIndexOf("}");
      if(first!==-1&&last!==-1) clean=clean.slice(first,last+1);
      const parsed=JSON.parse(clean);
      if(mode==="auto"){setGameFlow(parsed.gameFlow);setResult({tickets:parsed.tickets||[],lockOfNight:parsed.lockOfNight,mode:"auto"});}
      else{setResult({legs:parsed.legs||[],assessment:parsed.parlayAssessment,mode:"custom"});}
    }catch(e){setError("Analysis failed — the AI response couldn't be read. Try again, or adjust your settings.");}
    setLoading(false);
  };

  const JUICE_OPTIONS = betMode==="har" ? [
    {k:"h1",label:"Tier 1",sub:`$${stake} → win $500-1K`,color:"#22C55E"},
    {k:"h2",label:"Tier 2",sub:`$${stake} → win $1K-2K`,color:C.gold},
    {k:"h3",label:"Tier 3",sub:`$${stake} → win $2K-5K`,color:"#F97316"},
    {k:"h4",label:"Tier 4",sub:`$${stake} → win $5K+`,color:"#EF4444"},
  ] : [
    {k:"conservative",label:"Conservative",sub:"~+200 to +400",color:"#22C55E"},
    {k:"balanced",    label:"Balanced",    sub:"~+400 to +900",color:C.gold},
    {k:"longshot",    label:"Long Shot",   sub:"+1000 and up",color:"#F97316"},
    {k:"extreme",     label:"Extreme",     sub:"+3000 to +12000",color:"#EF4444"},
  ];

  const gameLabel=`Game ${gameNum} · ${gameNum<=2?"@ SAS":"@ NYK"}`;
  const copyTicket=(ticket)=>{
    const t=TIER_CFG[ticket.tier]||{label:ticket.tier};
    const legs=(ticket.legs||[]).map((l,i)=>`${i+1}. ${l.player} ${l.line} ${l.prop} (${l.odds||""})`).join("\n");
    const txt=`🏀 NBA FINALS ${gameLabel}\n${t.label?.replace(/[⭐]/g,"").trim()} PARLAY (${ticket.legs?.length||0} legs)\n\n${legs}\n\n💰 ${ticket.odds} · ${ticket.payout}\n— picks via NBA Finals Hub 🧡💙`;
    navigator.clipboard?.writeText(txt).then(()=>{setCopiedTier(ticket.tier);setTimeout(()=>setCopiedTier(null),2200);}).catch(()=>{});
  };
  const copyParlay=()=>{
    if(!(result?.mode==="custom"&&result.legs))return;
    const a=result.assessment;
    const txt=`🏀 NBA FINALS ${gameLabel} — My Parlay\n\n${result.legs.map((l,i)=>`${i+1}. ${l.player} ${l.line} ${l.prop} (${l.odds||""})`).join("\n")}\n\n💰 ${a?.estimatedOdds||""} · ${a?.payout||""} · ${a?.recommendation||""}\n— via NBA Finals Hub 🧡💙`;
    navigator.clipboard?.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}).catch(()=>{});
  };

  return(
    <div>
      <div style={{borderRadius:14,background:"linear-gradient(135deg,rgba(212,168,67,0.14),rgba(26,143,227,0.08))",border:"1px solid rgba(212,168,67,0.45)",padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:20}}>⚡</span><div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.gold,letterSpacing:3,fontWeight:900}}>PARLAY PICKS ANALYZER</div><div style={{fontSize:10,color:C.goldDim,fontFamily:"monospace",letterSpacing:1}}>Powered by Claude Opus 4.5 · SGP intelligence</div></div></div>
        <div style={{fontSize:10,color:C.light,lineHeight:1.6,marginBottom:8}}>Analyzes H2H stats, defensive matchups, home/away splits, rest days, last-3-game trends, and prop correlation to generate or evaluate same-game parlay legs.</div>
        <div style={{padding:"6px 10px",borderRadius:6,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.22)"}}><div style={{fontSize:9,color:"#EF4444",fontFamily:"monospace",letterSpacing:1,fontWeight:700}}>⚠ Entertainment only. Always gamble responsibly.</div></div>
      </div>

      <div style={{display:"flex",gap:4,background:"rgba(0,0,0,0.6)",borderRadius:8,padding:3,marginBottom:14}}>
        {[["auto","⚡ AI Suggests"],["custom","🎯 My Picks"]].map(([k,lbl])=>(
          <button key={k} onClick={()=>{setMode(k);setResult(null);}} style={{flex:1,padding:"9px 4px",borderRadius:6,border:"none",cursor:"pointer",background:mode===k?"rgba(212,168,67,0.25)":"transparent",color:mode===k?C.gold:C.dim,fontSize:11,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:mode===k?800:500,transition:"all 0.2s"}}>{lbl}</button>
        ))}
      </div>

      {/* Bet mode: Standard vs Har Mode */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:700}}>Odds Mode</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>switchBetMode("standard")} style={{flex:1,padding:"10px 8px",borderRadius:9,border:`1px solid ${betMode==="standard"?"rgba(26,143,227,0.6)":"rgba(255,255,255,0.1)"}`,cursor:"pointer",background:betMode==="standard"?"rgba(26,143,227,0.15)":"rgba(255,255,255,0.02)",textAlign:"left",transition:"all 0.2s"}}>
            <div style={{fontSize:12,color:betMode==="standard"?C.nykBlue:C.light,fontFamily:"monospace",fontWeight:800,letterSpacing:0.5}}>📊 STANDARD</div>
            <div style={{fontSize:9,color:betMode==="standard"?C.nykBlue+"CC":C.mid,fontFamily:"monospace",marginTop:3}}>Realistic sportsbook odds</div>
          </button>
          <button onClick={()=>switchBetMode("har")} style={{flex:1,padding:"10px 8px",borderRadius:9,border:`1px solid ${betMode==="har"?"rgba(212,168,67,0.6)":"rgba(255,255,255,0.1)"}`,cursor:"pointer",background:betMode==="har"?"rgba(212,168,67,0.15)":"rgba(255,255,255,0.02)",textAlign:"left",transition:"all 0.2s"}}>
            <div style={{fontSize:12,color:betMode==="har"?C.gold:C.light,fontFamily:"monospace",fontWeight:800,letterSpacing:0.5}}>🎰 HAR MODE</div>
            <div style={{fontSize:9,color:betMode==="har"?C.goldLight:C.mid,fontFamily:"monospace",marginTop:3}}>$X to win big — for fun</div>
          </button>
        </div>
      </div>

      {/* Stake input */}
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"10px 12px"}}>
        <span style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>Your Stake</span>
        <span style={{fontSize:18,color:C.light,fontFamily:"monospace",fontWeight:800}}>$</span>
        <input type="number" min="1" max="10000" value={stake} onChange={e=>{const v=parseInt(e.target.value)||1;setStake(Math.min(10000,Math.max(1,v)));setResult(null);}} style={{flex:1,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(212,168,67,0.3)",borderRadius:6,color:C.gold,fontSize:16,fontFamily:"monospace",fontWeight:800,padding:"7px 10px",outline:"none",textAlign:"center"}}/>
        <div style={{display:"flex",gap:4}}>
          {[20,50,100].map(v=><button key={v} onClick={()=>{setStake(v);setResult(null);}} style={{padding:"5px 9px",borderRadius:5,border:`1px solid ${stake===v?"rgba(212,168,67,0.5)":"rgba(255,255,255,0.1)"}`,background:stake===v?"rgba(212,168,67,0.15)":"transparent",color:stake===v?C.gold:C.dim,fontSize:10,fontFamily:"monospace",fontWeight:700,cursor:"pointer"}}>${v}</button>)}
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <div style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:700}}>Select Game</div>
        <div style={{display:"flex",gap:4}}>
          {[1,2,3,4,5,6,7].map(n=>(
            <button key={n} onClick={()=>{setGameNum(n);setResult(null);}} style={{flex:1,padding:"9px 0",borderRadius:7,border:`1px solid ${gameNum===n?"rgba(212,168,67,0.55)":"rgba(255,255,255,0.10)"}`,cursor:"pointer",background:gameNum===n?"rgba(212,168,67,0.20)":"rgba(255,255,255,0.03)",color:gameNum===n?C.gold:C.dim,fontSize:11,fontFamily:"monospace",fontWeight:gameNum===n?800:500,transition:"all 0.2s"}}>G{n}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"10px 13px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,color:C.gold,fontFamily:"monospace",fontWeight:800}}>GAME {gameNum} · {gameNum<=2?"✈️ Frost Bank Center (SAS Home)":"🏠 Madison Square Garden (NYK Home)"}</div><div style={{fontSize:10,color:C.light,fontFamily:"monospace",marginTop:3}}>{REST_DAYS[gameNum]} days rest · {gameNum<=2?"Wemby elevated at home — expect 30+ ceiling":"Brunson feeds off MSG crowd — 4Q scoring up"}</div></div>
          <div style={{padding:"4px 10px",borderRadius:5,background:gameNum<=2?"rgba(196,206,212,0.12)":"rgba(26,143,227,0.12)",border:`1px solid ${gameNum<=2?"rgba(196,206,212,0.25)":"rgba(26,143,227,0.3)"}`}}><div style={{fontSize:11,color:gameNum<=2?C.sasSilver:C.nykBlue,fontFamily:"monospace",fontWeight:800}}>{gameNum<=2?"SAS":"NYK"} HOME</div></div>
        </div>
      </div>

      {mode==="auto"&&(
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><div style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Number of Legs</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:C.gold,letterSpacing:2}}>{numLegs} LEGS</div></div>
          <div style={{display:"flex",gap:5,marginBottom:8}}>
            {[2,3,4,5,6].map(n=>(
              <button key={n} onClick={()=>setNumLegs(n)} style={{flex:1,padding:"9px 0",borderRadius:7,border:`1px solid ${numLegs===n?"rgba(212,168,67,0.55)":"rgba(255,255,255,0.10)"}`,cursor:"pointer",background:numLegs===n?"rgba(212,168,67,0.20)":"rgba(255,255,255,0.03)",color:numLegs===n?C.gold:C.dim,fontSize:13,fontFamily:"monospace",fontWeight:numLegs===n?800:500,transition:"all 0.2s"}}>{n}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:8,padding:"6px 8px"}}>
            <span style={{fontSize:9,color:C.mid,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Custom</span>
            <button onClick={()=>setNumLegs(n=>Math.max(2,n-1))} style={{width:30,height:30,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:C.gold,fontSize:18,fontWeight:800,cursor:"pointer",lineHeight:1}}>−</button>
            <input type="number" min="2" max="20" value={numLegs} onChange={e=>{const v=parseInt(e.target.value)||2;setNumLegs(Math.min(20,Math.max(2,v)));}} style={{flex:1,textAlign:"center",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(212,168,67,0.3)",borderRadius:6,color:C.gold,fontSize:16,fontFamily:"monospace",fontWeight:800,padding:"6px",outline:"none"}}/>
            <button onClick={()=>setNumLegs(n=>Math.min(20,n+1))} style={{width:30,height:30,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:C.gold,fontSize:18,fontWeight:800,cursor:"pointer",lineHeight:1}}>+</button>
            <span style={{fontSize:9,color:C.dim,fontFamily:"monospace"}}>max 20</span>
          </div>
        </div>
      )}

      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:C.gold,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:700}}>Risk / Juice Level</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {JUICE_OPTIONS.map(({k,label,sub,color})=>(
            <button key={k} onClick={()=>{setJuiceLevel(k);setResult(null);}} style={{padding:"11px 8px",borderRadius:9,border:`1px solid ${juiceLevel===k?color+"66":"rgba(255,255,255,0.09)"}`,cursor:"pointer",background:juiceLevel===k?color+"18":"rgba(255,255,255,0.02)",transition:"all 0.2s",textAlign:"left"}}>
              <div style={{fontSize:11,color:juiceLevel===k?color:C.light,fontFamily:"monospace",fontWeight:juiceLevel===k?800:600,letterSpacing:0.5,textTransform:"uppercase"}}>{label}</div>
              <div style={{fontSize:10,color:juiceLevel===k?color+"CC":C.mid,fontFamily:"monospace",marginTop:3,fontWeight:600}}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {mode==="custom"&&(
        <div style={{borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.10)",padding:"14px",marginBottom:14}}>
          <div style={{fontSize:11,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:12,fontWeight:700}}>Build Your Parlay</div>
          {customLegs.map((leg,i)=>(
            <div key={i} style={{marginBottom:10,padding:"10px 12px",borderRadius:8,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.09)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:11,color:C.gold,fontFamily:"monospace",letterSpacing:2,fontWeight:800}}>LEG {i+1}</span>
                {customLegs.length>1&&<button onClick={()=>removeLeg(i)} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:5,color:"#EF4444",fontSize:10,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",fontWeight:700}}>Remove</button>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <select value={leg.player} onChange={e=>updateLeg(i,"player",e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.13)",borderRadius:6,color:C.text,fontSize:12,padding:"8px 10px",fontFamily:"monospace",outline:"none",fontWeight:700}}>
                  <optgroup label="— NYK —" style={{background:"#080808"}}>{NYK_PLAYERS_LIST.map(p=><option key={p} value={p}>{p}</option>)}</optgroup>
                  <optgroup label="— SAS —" style={{background:"#080808"}}>{SAS_PLAYERS_LIST.map(p=><option key={p} value={p}>{p}</option>)}</optgroup>
                </select>
                <div style={{display:"flex",gap:6}}>
                  <select value={leg.prop} onChange={e=>updateLeg(i,"prop",e.target.value)} style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.13)",borderRadius:6,color:C.text,fontSize:11,padding:"8px 8px",fontFamily:"monospace",outline:"none",fontWeight:700}}>
                    {PROP_TYPES.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                  <input value={leg.line} onChange={e=>updateLeg(i,"line",e.target.value)} placeholder="e.g. Over 26.5" style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.13)",borderRadius:6,color:C.text,fontSize:11,padding:"8px 8px",fontFamily:"monospace",outline:"none",fontWeight:700}}/>
                </div>
              </div>
            </div>
          ))}
          {customLegs.length<20&&<button onClick={addLeg} style={{width:"100%",background:"transparent",border:"1px dashed rgba(212,168,67,0.4)",borderRadius:8,color:C.goldDim,fontSize:11,padding:"10px",cursor:"pointer",fontFamily:"monospace",letterSpacing:1,fontWeight:700}}>+ ADD LEG ({customLegs.length}/20)</button>}
        </div>
      )}

      <button onClick={analyze} disabled={loading} style={{width:"100%",padding:"15px",borderRadius:10,border:"1px solid rgba(212,168,67,0.6)",cursor:loading?"not-allowed":"pointer",background:loading?"rgba(212,168,67,0.05)":"linear-gradient(135deg,rgba(212,168,67,0.24),rgba(26,143,227,0.12))",color:loading?C.goldDim:C.gold,fontSize:14,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",fontWeight:800,marginBottom:16,transition:"all 0.2s",boxShadow:loading?"none":"0 0 28px rgba(212,168,67,0.18)"}}>
        {loading?"⚡ Claude Opus 4.5 Analyzing...":mode==="auto"?`⚡ Generate ${numLegs}-Leg ${betMode==="har"?"🎰 Har Mode":""} Picks`:`⚡ Evaluate My ${customLegs.length}-Leg Parlay`}
      </button>

      {error&&<div style={{borderRadius:10,background:"rgba(239,68,68,0.09)",border:"1px solid rgba(239,68,68,0.28)",padding:"12px 14px",marginBottom:14}}><div style={{fontSize:11,color:"#EF4444",fontFamily:"monospace",fontWeight:700}}>{error}</div></div>}

      {result?.mode==="auto"&&(
        <div>
          {gameFlow&&<div style={{borderRadius:10,background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,padding:"12px 14px",marginBottom:14}}><div style={{fontSize:10,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:7,fontWeight:700}}>🏀 Game {gameNum} Flow Prediction</div><div style={{fontSize:11,color:C.light,lineHeight:1.7,fontWeight:500}}>{gameFlow}</div></div>}
          <LockOfNight lock={result.lockOfNight}/>
          <div style={{fontSize:10,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,fontWeight:700}}>🎟️ {numLegs}-Leg Tickets · Pick Your Poison</div>
          {["suggested","safe","value","longshot"].map(tier=>{
            const ticket=result.tickets?.find(t=>t.tier===tier);
            if(!ticket)return null;
            return <ParlayTicket key={tier} ticket={ticket} stake={stake} onCopy={copyTicket} copiedTier={copiedTier}/>;
          })}
        </div>
      )}

      {result?.mode==="custom"&&(
        <div>
          {result.assessment&&<ParlayAssessment assessment={result.assessment}/>}
          {result.assessment&&<button onClick={copyParlay} style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid rgba(212,168,67,0.4)",background:copied?"rgba(34,197,94,0.15)":"rgba(212,168,67,0.1)",color:copied?"#22C55E":C.gold,fontSize:11,fontFamily:"monospace",letterSpacing:1,fontWeight:700,cursor:"pointer",marginBottom:14,transition:"all 0.2s"}}>{copied?"✓ COPIED TO CLIPBOARD":"📋 COPY PARLAY TO SHARE"}</button>}
          <div style={{fontSize:11,color:C.gold,letterSpacing:3,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,fontWeight:700}}>Leg Analysis</div>
          {result.legs?.map((leg,i)=><PickCard key={i} pick={{...leg,team:GAME_CONTEXT.players[customLegs[i]?.player]?.team||"NYK"}}/>)}
        </div>
      )}

      {!result&&!loading&&(
        <div style={{textAlign:"center",padding:"32px 20px",opacity:0.7}}>
          <div style={{fontSize:38,marginBottom:14}}>⚡</div>
          <div style={{fontSize:13,color:C.light,fontFamily:"monospace",fontWeight:700}}>{mode==="auto"?"Configure settings above and hit Generate":"Build your parlay legs and hit Evaluate"}</div>
          <div style={{fontSize:10,color:C.gold,fontFamily:"monospace",marginTop:8,fontWeight:600}}>Claude Opus 4.5 · most capable reasoning model</div>
        </div>
      )}
    </div>
  );
}
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── INTRO SPLASH (full-screen opening sequence) ──────────────────────────────
function IntroSplash({onDone}){
  const G="#D4A843", GL="#F5DC80";
  useEffect(()=>{
    const t=setTimeout(onDone,3400);
    return()=>clearTimeout(t);
  },[onDone]);
  return(
    <div onClick={onDone} style={{position:"fixed",inset:0,zIndex:9999,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}}>
      {/* Diagonal V-frame split */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:"50%",background:"linear-gradient(135deg,rgba(0,107,182,0.32) 0%,rgba(0,107,182,0.05) 55%,transparent 100%)",animation:"introSlideL 1s ease both"}}/>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:"50%",background:"linear-gradient(225deg,rgba(196,206,212,0.20) 0%,rgba(196,206,212,0.04) 55%,transparent 100%)",animation:"introSlideR 1s ease both"}}/>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"2px",height:"100%",background:`linear-gradient(180deg,transparent,${G},transparent)`,opacity:0.6,animation:"introFade 1.2s ease both"}}/>
      </div>
      {/* Gold corner accents */}
      <div style={{position:"absolute",top:0,left:0,width:120,height:120,background:`linear-gradient(135deg,${G}55 0%,transparent 60%)`,animation:"introFade 1.4s ease both"}}/>
      <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:`linear-gradient(225deg,${G}55 0%,transparent 60%)`,animation:"introFade 1.4s ease both"}}/>
      <div style={{position:"absolute",bottom:0,left:0,width:120,height:120,background:`linear-gradient(45deg,${G}3A 0%,transparent 60%)`,animation:"introFade 1.6s ease both"}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:120,height:120,background:`linear-gradient(315deg,${G}3A 0%,transparent 60%)`,animation:"introFade 1.6s ease both"}}/>

      {/* Center content */}
      <div style={{position:"relative",textAlign:"center",padding:"0 20px"}}>
        <div style={{fontSize:13,color:GL,letterSpacing:10,fontFamily:"monospace",fontWeight:700,marginBottom:6,animation:"introDrop 0.8s ease both"}}>2026 · NBA</div>
        <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:72,lineHeight:0.85,background:`linear-gradient(180deg,${GL} 0%,${G} 45%,#7A5A18 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:5,animation:"introZoom 1s cubic-bezier(.2,.8,.2,1) both",filter:`drop-shadow(0 0 30px ${G}66)`}}>FINALS</div>

        {/* Trophy */}
        <div style={{fontSize:64,lineHeight:1,margin:"10px 0",animation:"introTrophy 1.2s cubic-bezier(.2,.8,.2,1) both",filter:`drop-shadow(0 0 28px ${G}AA)`}}>🏆</div>

        {/* Teams */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,marginTop:6,animation:"introRise 1s ease 0.4s both"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:40,color:"#1A8FE3",textShadow:"0 0 24px rgba(0,107,182,0.8)",letterSpacing:2,lineHeight:1}}>NYK</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#FF8C2A",letterSpacing:3}}>KNICKS</div>
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:G,letterSpacing:2,textShadow:`0 0 16px ${G}88`}}>VS</div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:40,color:"#D8E4EC",letterSpacing:2,lineHeight:1}}>SAS</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#9AAAB8",letterSpacing:3}}>SPURS</div>
          </div>
        </div>

        <div style={{marginTop:18,display:"flex",justifyContent:"center",gap:30,animation:"introRise 1s ease 0.7s both"}}>
          <div style={{fontSize:8,color:"#FF8C2A",fontFamily:"monospace",fontWeight:700,letterSpacing:1,lineHeight:1.4}}>EASTERN CONF.<br/>CHAMPIONS</div>
          <div style={{fontSize:8,color:"#9AAAB8",fontFamily:"monospace",fontWeight:700,letterSpacing:1,lineHeight:1.4}}>WESTERN CONF.<br/>CHAMPIONS</div>
        </div>

        <div style={{marginTop:22,fontSize:9,color:G,letterSpacing:5,fontFamily:"monospace",fontWeight:600,animation:"introPulse 2s ease 1.2s infinite"}}>★ NEW YORK'S FIRST SINCE 1999 ★</div>
        <div style={{marginTop:28,fontSize:8,color:"#5A6A85",letterSpacing:3,fontFamily:"monospace",animation:"introFade 1s ease 1.8s both"}}>tap to enter</div>
      </div>
    </div>
  );
}

export default function NBAFinalsHub(){
  const[showIntro,setShowIntro]=useState(true);
  const[nykWins]=useState(0);
  const[sasWins]=useState(0);
  const[activeTab,setActiveTab]=useState("home");
  const[statsInitialGame,setStatsInitialGame]=useState(null);

  const tabs=[
    {id:"home",  label:"Home",  icon:"⌂"},
    {id:"scores",label:"Scores",icon:"◎"},
    {id:"stats", label:"Stats", icon:"▦"},
    {id:"picks", label:"Picks", icon:"⚡"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter','Helvetica Neue',sans-serif",position:"relative"}}>
      {showIntro&&<IntroSplash onDone={()=>setShowIntro(false)}/>}
      <div style={{position:"fixed",top:-150,left:"50%",transform:"translateX(-50%)",width:700,height:350,background:"radial-gradient(ellipse,rgba(212,168,67,0.10) 0%,rgba(0,107,182,0.05) 40%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-80,right:-80,width:350,height:350,background:"radial-gradient(ellipse,rgba(245,132,38,0.04) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes introZoom{from{opacity:0;transform:scale(1.4)}to{opacity:1;transform:scale(1)}}
        @keyframes introTrophy{from{opacity:0;transform:translateY(-30px) scale(0.6)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes introDrop{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes introRise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes introFade{from{opacity:0}to{opacity:1}}
        @keyframes introSlideL{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes introSlideR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes introPulse{0%,100%{opacity:1}50%{opacity:.45}}
        *{box-sizing:border-box;margin:0;padding:0}
        select,input{appearance:none;-webkit-appearance:none;}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(212,168,67,0.45);border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(0,0,0,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(212,168,67,0.22)",padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,background:"linear-gradient(90deg,#C9A84C,#F0D080,#C9A84C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NBA FINALS HUB</div>
          <div style={{fontSize:9,color:C.goldDim,letterSpacing:2,fontFamily:"monospace",marginTop:1}}>2025–26 · NYK vs SAS</div>
        </div>
        <div style={{fontSize:9,color:C.dim,fontFamily:"monospace",textAlign:"right"}}>
          <div style={{color:C.gold,marginBottom:1,letterSpacing:1}}>● LIVE</div>
          <div>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 14px 100px",position:"relative",zIndex:1,animation:"fadeUp .5s ease both"}}>
        {activeTab==="home"   &&<HomeTab nykWins={nykWins} sasWins={sasWins}/>}
        {activeTab==="scores" &&<ScoresTab nykWins={nykWins} sasWins={sasWins} onGameClick={g=>{setStatsInitialGame(g);setActiveTab("stats");}}/>}
        {activeTab==="stats"  &&<StatsTab initialGame={statsInitialGame}/>}
        {activeTab==="picks"  &&<PicksTab/>}
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(0,0,0,0.98)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(212,168,67,0.22)",padding:"10px 0 max(10px,env(safe-area-inset-bottom))",display:"flex"}}>
        {tabs.map(tab=>{
          const active=tab.id===activeTab;
          return(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
            <div style={{fontSize:15,filter:active?"none":"grayscale(1) opacity(.35)",transition:"all .2s",transform:active?"translateY(-1px)":"none"}}>{tab.icon}</div>
            <div style={{fontSize:8,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase",color:active?C.gold:"#3A4460",transition:"color .2s"}}>{tab.label}</div>
            {active&&<div style={{width:20,height:2,borderRadius:1,background:"linear-gradient(90deg,#C9A84C,#F0D080,#C9A84C)",marginTop:1}}/>}
          </button>);
        })}
      </div>
    </div>
  );
}
