import React,{useState} from 'react';
import {asset} from '../site';
import episodes from '../content/episodes.json';
export default function PodcastSection({en}){const [selected,setSelected]=useState(0);const episode=episodes[selected];return <div className="podcast"><div className="player"><iframe key={episode.id} src={`https://www.youtube.com/embed/${episode.id}?playsinline=1&rel=0`} title={episode.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/></div><h3 className="episode-title">{episode.title}</h3><a className="text-link" href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noreferrer">{en?'Watch on YouTube':'Ver en YouTube'} ↗</a><div className="episode-list" aria-label={en?'Choose an episode':'Seleccionar episodio'}>{episodes.map((item,i)=>i===selected?null:<button key={item.id} onClick={()=>setSelected(i)}><img src={asset(item.thumbnail||'media/podcast-'+item.id+'.webp')} alt="" width="320" height="180" loading="lazy"/><span>{item.title}</span></button>)}</div></div>;}


