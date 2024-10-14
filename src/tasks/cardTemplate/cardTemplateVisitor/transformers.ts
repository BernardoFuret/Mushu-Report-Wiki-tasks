import { type TCardTemplateParameters } from './types';

const getCardTemplateContent = (pageContent: string) => {
  const [cardTemplateContent] =
    /(?<=^[ \t]*\{\{card[ \t]*\n)(.+?)(?=\n\}\})/ims.exec(pageContent) || [];

  return cardTemplateContent;
};

const replaceCardTemplateParameters = (
  cardTemplateContent: string,
  parameters: TCardTemplateParameters,
) => {
  const parametersNames = Object.keys(parameters);

  return parametersNames.length
    ? cardTemplateContent.replace(
        new RegExp(`(?<=^[ \\t]*\\|[ \\t]*(${parametersNames.join('|')})[ \\t]*=)(.*?)$`, 'gmi'),
        (match, parameterName: string) => parameters[parameterName] || match,
      )
    : cardTemplateContent;
};

const insertCardTemplateParameters = (
  cardTemplateContent: string,
  parameters: TCardTemplateParameters,
) => {
  const formattedParameters = Object.entries(parameters).map(([parameterName, parameterValue]) => {
    return `|${parameterName}=${parameterValue}`;
  });

  return formattedParameters.length
    ? cardTemplateContent.replace(/$/, `\n${formattedParameters.join('\n')}`)
    : cardTemplateContent;
};

const sliceParametersByKind = (
  cardTemplateContent: string,
  parameters: TCardTemplateParameters,
): {
  paramatersToReplace: TCardTemplateParameters;
  parametersToInsert: TCardTemplateParameters;
} => {
  return Object.entries(parameters).reduce(
    (acc, [parameterName, parameterValue]) => {
      if (cardTemplateContent.match(parameterName)) {
        return {
          ...acc,
          paramatersToReplace: {
            ...acc.paramatersToReplace,
            [parameterName]: parameterValue,
          },
        };
      }

      return {
        ...acc,
        parametersToInsert: {
          ...acc.parametersToInsert,
          [parameterName]: parameterValue,
        },
      };
    },
    { paramatersToReplace: {}, parametersToInsert: {} },
  );
};

const updateCardTemplateContent = (
  cardTemplateContent: string,
  parameters: TCardTemplateParameters,
) => {
  const { paramatersToReplace, parametersToInsert } = sliceParametersByKind(
    cardTemplateContent,
    parameters,
  );

  const replacedCardTemplateContent = replaceCardTemplateParameters(
    cardTemplateContent,
    paramatersToReplace,
  );

  return insertCardTemplateParameters(replacedCardTemplateContent, parametersToInsert);
};

const updatePageContent = (pageContent: string, newCardTemplateContent: string) => {
  return pageContent.replace(
    /(?<=^[ \t]*\{\{card[ \t]*\n)(.+?)(?=\n\}\})/ims,
    newCardTemplateContent,
  );
};

const processPageContent = (pageContent: string, parameters: TCardTemplateParameters): string => {
  const cardTemplateContent = getCardTemplateContent(pageContent);

  if (!cardTemplateContent) {
    throw new Error('Unexpected page content', { cause: { pageContent } });
  }

  const newCardTemplateContent = updateCardTemplateContent(cardTemplateContent, parameters);

  const updatedPageContent = updatePageContent(pageContent, newCardTemplateContent);

  return updatedPageContent;
};

export { processPageContent };
