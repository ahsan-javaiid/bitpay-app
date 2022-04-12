import * as React from 'react';
import {ReactElement, ReactNode} from 'react';
import styled, {useTheme} from 'styled-components/native';
import {Action, LightBlack, SlateDark, White} from '../../styles/colors';
import Haptic from '../haptic-feedback/haptic';
import {
  ActiveOpacity,
  CardGutter,
  Row,
  ScreenGutter,
} from '../styled/Containers';
import Card from '../card/Card';
import {View} from 'react-native';
import {BaseText} from '../styled/Text';
import * as Svg from 'react-native-svg';
import {shouldScale} from '../../utils/helper-methods';
import IncrementArrow from '../../../assets/img/home/exchange-rates/increment-arrow.svg';
import DecrementArrow from '../../../assets/img/home/exchange-rates/decrement-arrow.svg';

const Arrow = ({isDark}: {isDark: boolean}) => {
  return (
    <Svg.Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <Svg.Path
        fill={isDark ? '#4F6EF7' : Action}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.65108 2.83329L8.4115 4.01737L12.2188 7.65419L1.41671 7.65419V9.34573L12.2188 9.34573L8.4115 12.9825L9.65108 14.1666L15.5834 8.49996L9.65108 2.83329Z"
      />
    </Svg.Svg>
  );
};

interface BodyProps {
  title?: string;
  description?: string;
  value?: string;
  pillText?: string;
  needsBackup?: boolean;
  percentageDifference?: number;
}

interface HomeCardProps {
  header?: ReactNode;
  body: BodyProps;
  onCTAPress?: () => void;
  backgroundImg?: () => ReactElement;
}

const CardHeader = styled.View`
  min-height: 20px;
`;

const CardBodyHeader = styled(BaseText)`
  font-size: 14px;
  line-height: 21px;
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  margin-top: ${CardGutter};
`;

const CardBodyDesc = styled(BaseText)`
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  margin-top: ${CardGutter};
`;

const CardPrice = styled(BaseText)<{scale: boolean}>`
  font-size: ${({scale}) => (scale ? 15 : 20)}px;
  line-height: 30px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
`;

const CardPill = styled.View`
  background-color: #cbf3e8;
  align-self: flex-start;
  border-radius: 7px;
  padding: 4px 8px;
`;

const CardPillText = styled(BaseText)`
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: ${SlateDark};
`;

const FooterArrow = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  align-self: flex-end;
  border-radius: 50px;
  background-color: ${({theme}) => (theme.dark ? '#0C204E' : '#ECEFFD')}
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled.TouchableOpacity`
  left: ${ScreenGutter};
`;

const NeedBackupText = styled(BaseText)`
  font-size: 12px;
  text-align: center;
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  padding: 2px 4px;
  border: 1px solid ${({theme: {dark}}) => (dark ? White : '#E1E4E7')};
  border-radius: 3px;
  position: absolute;
`;

const PercentageContainer = styled(BaseText)<{scale: boolean}>`
  font-size: ${({scale}) => (scale ? 10 : 12)}px;
  color: ${({theme}) => theme.colors.text};
`;

const PercentageRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HomeCard: React.FC<HomeCardProps> = ({body, onCTAPress, header}) => {
  const HeaderComp = <CardHeader>{header}</CardHeader>;
  const theme = useTheme();
  const {
    title,
    value,
    percentageDifference,
    pillText,
    description,
    needsBackup,
  } = body;

  const BodyComp = (
    <View>
      {title && <CardBodyHeader>{title}</CardBodyHeader>}
      {value && <CardPrice scale={shouldScale(value)}>{value}</CardPrice>}
      <PercentageRow>
        {percentageDifference && percentageDifference > 0 ? (
          <IncrementArrow style={{marginRight: 5}} />
        ) : null}
        {percentageDifference && percentageDifference < 0 ? (
          <DecrementArrow style={{marginRight: 5}} />
        ) : null}
        {percentageDifference ? (
          <PercentageContainer scale={shouldScale(value)}>
            {percentageDifference}%
          </PercentageContainer>
        ) : null}
      </PercentageRow>
      {pillText && (
        <CardPill>
          <CardPillText>{pillText}</CardPillText>
        </CardPill>
      )}
      {needsBackup && (
        <Row>
          <NeedBackupText>Needs Backup</NeedBackupText>
        </Row>
      )}
      {description && <CardBodyDesc>{description}</CardBodyDesc>}
    </View>
  );

  const _onPress = () => {
    if (onCTAPress) {
      Haptic('impactLight');
      onCTAPress();
    }
  };

  const FooterComp = (
    <FooterArrow activeOpacity={ActiveOpacity} onPress={_onPress}>
      <Arrow isDark={theme.dark} />
    </FooterArrow>
  );

  const containerProps = {
    backgroundColor: theme.dark ? LightBlack : White,
  };

  return (
    <CardContainer activeOpacity={ActiveOpacity} onPress={_onPress}>
      <Card
        header={HeaderComp}
        body={BodyComp}
        footer={FooterComp}
        containerProps={containerProps}
      />
    </CardContainer>
  );
};

export default HomeCard;
