// eslint-disable-next-line max-classes-per-file
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

let foundMoments: any = null;
let foundSeparators: any = null;
/** takes an item and creates banner view model */
export const formatMoments = (
  momentsRaw: IAFile[],
  iaMetadata: IAMD | any,
  landingURL: string,
  directoryToUse: string | undefined
): TimelineMoment[] => {
  foundMoments = {};
  foundSeparators = {};
  momentsRaw?.forEach((file: IAFile): void => {
    const { name, format } = file;

    if (format !== 'PNG') {
      return;
    }

    const close = name?.match(/(?:\/\d*-)/g) || [];
    const found = close[0];
    const order: string = found?.substring(1, found.length - 1);

    const isTimelineImg = name.includes(`${directoryToUse}/`);
    const isSeparator = name.includes(`${iaMetadata.separator_dir}/`);

    const hasMoment = isSeparator
      ? foundSeparators[order]
      : foundMoments[order];

    let moment = new Moment();

    if (hasMoment) {
      moment = hasMoment;
      if (isSeparator) {
        moment = foundSeparators[order];
      } else {
        moment = foundMoments[order];
      }
    }

    if ((isTimelineImg || isSeparator) && name.match('-full.png')) {
      const desktopImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
      moment.desktopImg = desktopImg;
    }

    if ((isTimelineImg || isSeparator) && name.match('-min.png')) {
      moment.mobileImg = `https://archive.org/cors/isa-9001599455299596/${name}`;
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
      const setAltText = iaMetadata[`text_${order}`];
      if (setAltText) {
        altText = setAltText;
      }

      const setLink = iaMetadata[`link_${order}`];
      if (setLink) {
        link = setLink;
      }
      moment.link = link;
      moment.altText = altText;
    }

    /* End alt and link text */
    if (isSeparator) {
      foundSeparators[order] = moment;
    } else {
      foundMoments[order] = moment;
    }
  });

  const moments = shuffle(Object.keys(foundMoments));
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
  foundMoments = null;
  foundSeparators = null;

  return displayList;
};
