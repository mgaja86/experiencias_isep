import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  apply() {
    const pageTitle = 'Comparte tu experiencia';
    const description = 'Queremos presumirle a todos el gran paso que acabas de dar por tu crecimiento profesional';
    const image = 'https://f005.backblazeb2.com/file/elearning-img/Logo+UISEP.png';

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
  }
}