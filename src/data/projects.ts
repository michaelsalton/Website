export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  isHovered: boolean;
  githubText?: string;
  liveText?: string;
  paperUrl?: string;
  paperText?: string;
}

export const projects: Project[] = [
  {
    title: "Discover Old D'Hanis",
    description: "Step into the past and unravel the rich history of Old D'Hanis. Explore this 19th-century town, from Alsatian and German settlers of 1847 to Black and Mexican families post-Civil War. Unearth archival fragments, archaeological photos, and oral histories to piece together the town's alluring stories.",
    technologies: ["Unity", "C#", "Photogrammetry", "Game Development"],
    githubUrl: "https://www.discoverolddhanis.com/",
    liveUrl: "https://store.steampowered.com/app/3140860/Discover_Old_DHanis/",
    image: "/images/dod.jpg",
    isHovered: false,
    githubText: "Website",
    liveText: "Steam"
  },
  {
    title: "Software Rasterizer",
    description: "A fully-featured 3D software rasterizer from scratch using C++. This project implements a complete rendering pipeline in software, demonstrating how modern GPUs work internally without any hardware acceleration.",
    technologies: ["C++", "SDL", "Rendering"],
    githubUrl: "https://github.com/michaelsalton/Software-Rasterizer",
    liveUrl: null,
    image: "/images/link.png",
    isHovered: false,
  },
  {
    title: "3D Pixel Art Engine",
    description: "An innovative engine for creating and rendering 3D pixel art, combining retro aesthetics with modern techniques.",
    technologies: ["C++", "Rendering"],
    githubUrl: "https://github.com/michaelsalton/3D-Pixel-Art-Engine",
    liveUrl: null,
    image: "/images/pixel.png",
    isHovered: false,
  },
  {
    title: "Project Lambda",
    description: "An AI project exploring reinforcement learning in Counter-Strike using OpenAI Gym. The goal was to create an AI agent that plays like a human while relying solely on visual input, without accessing game memory. The agent was trained on professional gameplay footage using behavioral cloning and offline reinforcement learning.",
    technologies: ["Python", "Machine Learning"],
    githubUrl: "https://github.com/michaelsalton/ProjectLambda?tab=readme-ov-file",
    liveUrl: "https://www.youtube.com/watch?v=huGKr469u5g",
    image: "/images/cs.jpg",
    isHovered: false,
    githubText: "GitHub",
    liveText: "Video Demo",
    paperUrl: "https://github.com/michaelsalton/ProjectLambda/blob/main/Comparing_AI_Navigation_Methods_Using_Counter_Strike__Global_Offensive.pdf",
    paperText: "Paper"
  },
  {
    title: "Saga",
    description: "An survival game set in Iceland during the Saga Age. Players will explore, gather resources, manage a settlement and more while following stories inspired by the Sagas of Icelanders.",
    technologies: ["Unity", "C#", "Game Development"],
    githubUrl: "https://github.com/michaelsalton/Saga",
    liveUrl: null,
    image: "/images/saga.png",
    isHovered: false,
  },
  {
    title: "The Wild Waste",
    description: "A post-apocalyptic game project exploring survival mechanics and environmental storytelling.",
    technologies: ["Unity", "C#", "Game Design"],
    githubUrl: "https://github.com/michaelsalton/The-Wild-Waste",
    liveUrl: null,
    image: "/images/wild.png",
    isHovered: false,
  },
  {
    title: "misanthrope",
    description: "A game that blends 3D and 2D elements to create a unique sketchbook aesthetic. Features include procedural object placement using Poisson Disc Sampling, dynamic day/night cycle, and custom toon shaders.",
    technologies: ["Unity", "C#", "Game Development"],
    githubUrl: "https://github.com/michaelsalton/misanthrope",
    liveUrl: null,
    image: "/images/mis.png",
    isHovered: false,
  }
]; 