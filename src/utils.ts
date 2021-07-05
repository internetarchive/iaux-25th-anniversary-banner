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

/** takes an item and creates banner view model */
export const formatMoments = (
  momentsRaw: IAFile[],
  iaMetadata: IAMD | any,
  landingURL: string
): TimelineMoment[] => {
  const foundMoments: any = {};
  const foundSeparators: any = {};

  momentsRaw?.forEach((file: IAFile): void => {
    const { name, format } = file;

    const isTimelineImg = name.includes(`${iaMetadata.directory}/`);
    const isSeparator = name.includes(`${iaMetadata.separator_dir}/`);

    if (format !== 'PNG') {
      return;
    }
    const close = name?.match(/(?:\/\d*-)/g) || [];
    const found = close[0];
    const order = found?.substring(1, found.length - 1);
    let moment = new Moment();

    if (isSeparator && !foundSeparators[order]) {
      foundSeparators[order] = moment;
    }

    if (isTimelineImg && !foundMoments[order]) {
      foundMoments[order] = moment;
    }

    moment = isSeparator ? foundSeparators[order] : foundMoments[order];

    if (!moment) {
      return;
    }

    /* Find alt and link text */
    let altText = 'Internet Archive turns 25 milestone';
    let link = landingURL;
    if (isSeparator) {
      if (iaMetadata[`separator_text_${order}`]) {
        altText = iaMetadata[`separator_text_${order}`];
      }

      if (iaMetadata[`separator_link_${order}`]) {
        link = iaMetadata[`separator_link_${order}`];
      }
    }

    if (isTimelineImg) {
      if (iaMetadata[`text_${order}`]) {
        altText = iaMetadata[`text_${order}`];
      }

      if (iaMetadata[`link_${order}`]) {
        link = iaMetadata[`link_${order}`];
      }
    }
    moment.altText = altText;
    moment.link = link;
    /* End alt and link text */

    if (name.match('-full.png')) {
      moment.desktopImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
    }

    if (name.match('-min.png')) {
      moment.mobileImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
    }
  });

  const moments = Object.keys(foundMoments);
  const displayList: TimelineMoment[] = [];
  let separatorUsed = 1;
  moments.forEach((m, i) => {
    const order = i + 1;
    const isThird = order % 3 === 0;
    displayList.push(foundMoments[m]);

    if (isThird) {
      /* add separator */
      if (separatorUsed === 1) {
        displayList.push(foundSeparators[`01`]);
        separatorUsed = 0;
      } else {
        displayList.push(foundSeparators[`01`]);
      }
    }
  });
  return displayList;
};
