# To do:

Right now I have a structure that creates a static floater using THREE.js. What I want is an interactive music player experience with individual scenes for every song.

## Goals
0. ~~Add anchor, line, and relationship creation / destruction functionality~~
1. Get floater to animate
2. Get it to float around screen, bumping into walls
3. Basic Web Audio API integration
4. Support for guessing empty config properties
5. Handle updates to anchors, lines, relationships, segments
5. Support for colours / material changes
6. Support for scenes
7. Integration with Selected Ambien Twerks
8. Figure out how users can interact further with this

## Floater.js
1. ~~More discrete functions and properties. Each anchor, line, connector, relationship needs to have an updater~~
2. Animation handling with vectors for each anchor point
3. Support for walls
4. Handle empty config properties
5. Handle updates to anchors, lines, relationships, segments

## app.js
1. Separate geometry creation and geometry positioning.
2. Use Web Audio API to manipulate vertices
3. Support for colours / material changes
4. Support for scenes
5. Integrate with scenes.js
6. Music player controls
7. Integrate user interactions

## scenes.js
1. Design structure
2. Design each scene with Ben
