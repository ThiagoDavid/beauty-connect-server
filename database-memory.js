import { randomUUID } from "node:crypto";

export class DatabaseMemory {
  #videos  = null;
  constructor() {
    this.#videos = new Map();
  }
  get(id) {
    return this.#videos[id];
  }

  // Listagem de vídeos com parametro search opcional
  // Lista cada vídeo com id no objeto.
  // Se tiver parâmetro serach, só traz os que tem o texto incluso no title
  list(search) {
    return Array.from(this.#videos.entries())
      .map(([id, video]) => ({ id, ...video }))
      .filter(video => search ? video.title.toLowerCase().includes(search.toLowerCase()) : true);
  }

  create(video) {
    const videoId = randomUUID();
    this.#videos.set(videoId, video);
  }
  update(id, video) {
    this.#videos.set(id, video);
  }

  delete(id) {
    this.#videos.delete(id);
  }
}