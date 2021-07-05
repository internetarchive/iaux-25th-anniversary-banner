import { IAFile, IAMD, TimelineMoment } from './interfaces';

export class Moment implements TimelineMoment {
  altText: string;

  desktopImg: string;

  mobileImg: string;

  link: string | undefined;

  constructor() {
    this.altText = '';
    this.desktopImg = '';
    this.mobileImg = '';
    this.link = undefined;
  }
}

export const shuffle = (list: any[]) => {
  if (!Array.isArray(list)) {
    throw new TypeError(`Expected an Array, got ${typeof list} instead.`);
  }

  const oldArray = [...list];
  let newArray: any[] = [];

  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length);
    newArray = newArray.concat(oldArray.splice(i, 1));
  }
  return newArray;
};

/** takes an item's file list and c */
export const formatMoments = (
  momentsRaw: IAFile[],
  iaMetadata: IAMD | any,
  landingURL: string
): TimelineMoment[] => {
  const foundMoments: any = {};

  momentsRaw?.forEach((file: { name: string }): void => {
    const { name } = file;
    const isRelevant = name.includes(`${iaMetadata.directory}/`);
    if (!isRelevant) {
      return;
    }
    const close = name?.match(/(?:\/\d*-)/g) || [];

    if (!close.length) {
      // whole problem, but not really
    }

    const found = close[0];
    const order = found?.substring(1, found.length - 1);
    let moment;

    if (!foundMoments[order]) {
      foundMoments[order] = new Moment();
      moment = foundMoments[order];

      const altText =
        iaMetadata[`text_${order}`] || 'Internet Archive turns 25 milestone';
      moment.altText = altText;

      const link: string = iaMetadata[`link_${order}`] || landingURL;
      moment.link = link;
    }
    moment = foundMoments[order];
    if (name.match('-full.png')) {
      moment.desktopImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
    }

    if (name.match('-min.png')) {
      moment.mobileImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
    }
  });

  const moments = Object.keys(foundMoments);
  const catcher: TimelineMoment[] = [];
  moments.forEach(m => catcher.push(foundMoments[m]));
  return catcher;
};
