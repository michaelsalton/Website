export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  isHovered: boolean;
}

export const projects: Project[] = [
  {
    title: "Real-time Ray Tracer",
    description: "A GPU-accelerated ray tracer built with WebGL and GLSL, featuring real-time reflections, refractions, and global illumination. The project demonstrates advanced rendering techniques including PBR materials, dynamic scene editing, and interactive camera controls.",
    technologies: ["WebGL", "GLSL", "TypeScript", "Computer Graphics"],
    githubUrl: "https://github.com/michaelsalton/real-time-raytracer",
    liveUrl: "https://raytracer.michaelsalton.com",
    image: "/projects/raytracer.jpg",
    isHovered: false
  },
  {
    title: "Discover Old D'Hanis",
    description: "A journey through the historic town of Old D'Hanis, exploring its rich heritage and cultural significance.",
    technologies: ["Web Development", "History", "Documentation"],
    githubUrl: "https://github.com/michaelsalton/discover-old-dhanis",
    liveUrl: "https://discoverolddhanis.com",
    image: "/projects/discover-old-dhanis.jpg",
    isHovered: false
  },
  {
    title: "Saga Software Rasterizer",
    description: "A custom software rasterizer implementation, exploring the fundamentals of computer graphics and rendering techniques.",
    technologies: ["C++", "Computer Graphics", "Rendering"],
    githubUrl: "https://github.com/michaelsalton/saga-rasterizer",
    liveUrl: null,
    image: "/projects/saga-rasterizer.jpg",
    isHovered: false
  },
  {
    title: "3D Pixel Art Engine",
    description: "An innovative engine for creating and rendering 3D pixel art, combining retro aesthetics with modern techniques.",
    technologies: ["C++", "OpenGL", "Graphics Programming"],
    githubUrl: "https://github.com/michaelsalton/pixel-art-engine",
    liveUrl: null,
    image: "/projects/pixel-art-engine.jpg",
    isHovered: false
  },
  {
    title: "The Wild Waste",
    description: "A post-apocalyptic game project exploring survival mechanics and environmental storytelling.",
    technologies: ["Unity", "C#", "Game Design"],
    githubUrl: "https://github.com/michaelsalton/wild-waste",
    liveUrl: null,
    image: "/projects/wild-waste.jpg",
    isHovered: false
  },
  {
    title: "Misanthrope Maze Game",
    description: "A challenging maze game that explores themes of isolation and human nature through gameplay mechanics.",
    technologies: ["Unity", "C#", "Game Design"],
    githubUrl: "https://github.com/michaelsalton/misanthrope-maze",
    liveUrl: null,
    image: "/projects/misanthrope-maze.jpg",
    isHovered: false
  },
  {
    title: "Project Lambda",
    description: "An experimental game project exploring procedural generation and emergent gameplay systems.",
    technologies: ["C++", "Procedural Generation", "Game Development"],
    githubUrl: "https://github.com/michaelsalton/project-lambda",
    liveUrl: null,
    image: "/projects/project-lambda.jpg",
    isHovered: false
  },
  {
    title: "Unreal Engine Video Game",
    description: "A video game project built with Unreal Engine, showcasing advanced graphics and gameplay mechanics.",
    technologies: ["Unreal Engine", "C++", "Game Development"],
    githubUrl: "https://github.com/michaelsalton/unreal-game",
    liveUrl: null,
    image: "/projects/unreal-game.jpg",
    isHovered: false
  },
  {
    title: "Link's Treehouse",
    description: "A fan project recreating Link's iconic treehouse from The Legend of Zelda series in 3D.",
    technologies: ["3D Modeling", "Texturing", "Environment Design"],
    githubUrl: "https://github.com/michaelsalton/links-treehouse",
    liveUrl: null,
    image: "/projects/links-treehouse.jpg",
    isHovered: false
  }
]; 