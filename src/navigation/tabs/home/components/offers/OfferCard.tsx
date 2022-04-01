import React from 'react';
import {Image, ImageProps, ImageSourcePropType, Linking} from 'react-native';
import * as Svg from 'react-native-svg';
import {ContentCard} from 'react-native-appboy-sdk';
import styled from 'styled-components/native';
import ArrowRight from '../../../../../../assets/img/arrow-right.svg';
import haptic from '../../../../../components/haptic-feedback/haptic';
import {ScreenGutter} from '../../../../../components/styled/Containers';
import {BaseText} from '../../../../../components/styled/Text';
import {White} from '../../../../../styles/colors';
import {
  isCaptionedContentCard,
  isClassicContentCard,
} from '../../../../../utils/braze';
import {useAppDispatch, useAppSelector} from '../../../../../utils/hooks';
import {AppEffects} from '../../../../../store/app';
import {getStateFromPath, useNavigation} from '@react-navigation/native';
import {selectAvailableGiftCards} from '../../../../../store/shop/shop.selectors';
import {APP_DEEPLINK_PREFIX} from '../../../../../constants/config';
import {LogActions} from '../../../../../store/log';

interface OfferCardProps {
  contentCard: ContentCard;
}

const OFFER_HEIGHT = 182;
const OFFER_WIDTH = 260;

const OfferCardContainer = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 260px;
  height: 182px;
  left: ${ScreenGutter};
`;

const OfferBackgroundContainer = styled.View`
  border-radius: 12px;
  overflow: hidden;
  position: absolute;
`;

const OfferTitleText = styled(BaseText)`
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  text-transform: uppercase;
  line-height: 37px;
  letter-spacing: 1px;
  color: white;
  padding-left: 16px;
  padding-top: 88px;
  width: 194px;
`;

const DescriptionContainer = styled.View`
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  height: 38px;
`;

const DescriptionText = styled(BaseText)`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
  color: white;
  margin-left: 16px;
  width: 165px;
`;

const ArrowContainer = styled.View`
  width: 36px;
  height: 36px;
  background: #f3f4f5;
  margin-left: 26px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const FooterArrow = styled.TouchableHighlight`
  width: 30px;
  height: 30px;
  align-self: center;
  border-radius: 50px;
  background-color: ${White};
  align-items: center;
  justify-content: center;
`;

const OfferBackground: React.FC<Pick<ImageProps, 'source'>> = props => {
  return (
    <Image
      style={{
        height: OFFER_HEIGHT,
        width: OFFER_WIDTH,
      }}
      height={OFFER_HEIGHT}
      width={OFFER_WIDTH}
      {...props}
    />
  );
};

const OfferBackgroundOverlay = () => {
  return (
    <Svg.Svg
      viewBox="0 0 260 182"
      style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
      <Svg.Defs>
        <Svg.LinearGradient id="offer-gradient" x1={0} y1={0} x2={0} y2={1}>
          <Svg.Stop offset="0%" stopColor="#000" stopOpacity={0} />
          <Svg.Stop offset="100%" stopColor="#000" stopOpacity={0.8} />
        </Svg.LinearGradient>
      </Svg.Defs>
      <Svg.Rect
        id="gradient-rect"
        width={OFFER_WIDTH}
        height={OFFER_HEIGHT}
        fill="url(#offer-gradient)"
      />
    </Svg.Svg>
  );
};

const OfferCard: React.FC<OfferCardProps> = props => {
  const {contentCard} = props;
  const {image, url, openURLInWebView} = contentCard;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  let title = '';
  let description = '';
  let imageSource: ImageSourcePropType | null = null;

  const availableGiftCards = useAppSelector(selectAvailableGiftCards);

  if (
    isCaptionedContentCard(contentCard) ||
    isClassicContentCard(contentCard)
  ) {
    title = contentCard.title;
    description = contentCard.cardDescription;
  }

  if (image) {
    if (typeof image === 'string') {
      imageSource = {uri: image};
    } else if (__DEV__) {
      imageSource = image as any;
    }
  }

  const _onPress = () => {
    if (!url) {
      return;
    }

    haptic('impactLight');

    try {
      const path = url.replace(APP_DEEPLINK_PREFIX, '');
      const maybeParsedState = getStateFromPath(path);

      if (maybeParsedState?.routes.length) {
        const route = maybeParsedState.routes[0];

        if (route.name === 'giftcard') {
          if (route.params) {
            const merchantName = (
              (route.params as any).merchant || ''
            ).toLowerCase();
            const cardConfig = availableGiftCards.find(
              giftCard => giftCard.name.toLowerCase() === merchantName,
            );

            if (cardConfig) {
              navigation.navigate('GiftCard', {
                screen: 'BuyGiftCard',
                params: {
                  cardConfig,
                },
              });

              return;
            }
          }

          navigation.navigate('Shop', {
            screen: 'Home',
          });

          return;
        }
      }
    } catch (err) {
      dispatch(
        LogActions.debug('Something went wrong parsing offer URL: ' + url),
      );
      dispatch(LogActions.debug(JSON.stringify(err)));
    }

    if (openURLInWebView) {
      dispatch(AppEffects.openUrlWithInAppBrowser(url));
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <OfferCardContainer>
      {imageSource ? (
        <OfferBackgroundContainer>
          <OfferBackground source={imageSource} />
          <OfferBackgroundOverlay />
        </OfferBackgroundContainer>
      ) : null}

      <OfferTitleText>{title}</OfferTitleText>

      <DescriptionContainer>
        <DescriptionText>{description}</DescriptionText>

        <ArrowContainer>
          <FooterArrow onPress={_onPress} underlayColor="white">
            <ArrowRight />
          </FooterArrow>
        </ArrowContainer>
      </DescriptionContainer>
    </OfferCardContainer>
  );
};

export default OfferCard;
