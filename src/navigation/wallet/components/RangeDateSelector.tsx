import React, {useState} from 'react';
import styled from 'styled-components/native';
import {BaseText} from '../../../components/styled/Text';
import {Action, White} from '../../../styles/colors';
import {ActiveOpacity} from '../../../components/styled/Containers';
import {titleCasing} from '../../../utils/helper-methods';
import haptic from '../../../components/haptic-feedback/haptic';
import {DateRanges} from '../../../store/wallet/wallet.models';

interface Props {
  onPress: (dateRange: DateRanges) => void;
}

const ButtonsRow = styled.View`
  width: 100%;
  justify-content: space-evenly;
  flex-direction: row;
`;

const ButtonContainer = styled.View`
  align-items: center;
`;

const ButtonText = styled(BaseText)<{isActive: string; label: string}>`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
  color: ${({isActive, label, theme}) =>
    isActive === label ? White : theme.colors.text};
`;

const LinkButton = styled.TouchableOpacity<{isActive: string; label: string}>`
  height: 46px;
  width: 58px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background: ${({isActive, label}) =>
    isActive === label ? Action : 'transparent'};
`;

const RangeDateSelector = ({onPress}: Props) => {
  const [activeOption, setActiveOption] = useState<DateRanges>(DateRanges.Day);
  const updateOptions: Array<{label: string; dateRange: DateRanges}> = [
    {label: '1D', dateRange: DateRanges.Day},
    {label: '1W', dateRange: DateRanges.Week},
    {label: '1M', dateRange: DateRanges.Month},
  ];
  const isActive = updateOptions.find(
    opt => opt.dateRange === activeOption,
  ) as {label: string; dateRange: DateRanges};

  return (
    <ButtonsRow>
      {updateOptions.map(({label, dateRange}) => (
        <ButtonContainer key={label}>
          <LinkButton
            activeOpacity={ActiveOpacity}
            isActive={isActive.label}
            label={label}
            onPress={() => {
              haptic('impactLight');
              if (isActive.label !== label) {
                setActiveOption(dateRange);
                onPress(dateRange);
              }
            }}>
            <ButtonText isActive={isActive.label} label={label}>
              {titleCasing(label)}
            </ButtonText>
          </LinkButton>
        </ButtonContainer>
      ))}
    </ButtonsRow>
  );
};

export default RangeDateSelector;
