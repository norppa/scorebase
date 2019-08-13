# ScoreBase

Simple website for viewing music stored in abc notation.

## Features

Basic mode and administrator mode. In basic mode user can view tunes, transpose them (non-persistent) and export as pdf. User can also select a random tune. In administrator mode user can additionally add new tunes and remove or edit existing tunes. Editing is text-based and the tunes are stored in abc format. While editing user can see a real-time rendering of the abc score.

## Technologies

Node back end with Express that connects to an external SQL database. React front end that uses abcjs for rendering the scores. 
