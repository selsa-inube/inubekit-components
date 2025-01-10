import { forwardRef, useContext } from "react";

import {
  MdOutlineCancel,
  MdOutlineChevronRight,
  MdOutlineError,
} from "react-icons/md";

import { Icon } from "../Icon";
import { Label } from "../Label";
import { Stack } from "../Stack";
import { Text } from "../Text";
import { ITextAppearance } from "../Text/props";

import { OptionList } from "./OptionList";
import { OptionItem } from "./OptionItem";
import { IOption, ISelect } from ".";
import { ISelectSize } from "./props";
import {
  StyledContainer,
  StyledInput,
  StyledInputContainer,
  StyledChevron,
} from "./styles";

import { ThemeContext } from "styled-components";
import { tokens as InputTokens } from "../Input/tokens";

interface IMessage {
  message: ISelect["message"];
}

interface ISelectInterface extends ISelect {
  displayList: boolean;
  focused?: boolean;
  handleClear: () => void;
  maxItems: number;
  onOptionClick: (value: string) => void;
  readOnly: boolean;
  checkedItems: string[];
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getTypo = (size: ISelectSize) => {
  if (size === "compact") {
    return "medium";
  }
  return "large";
};

function getOptionLabel(options: IOption[], value: string) {
  const option = options.find((option) => option.value === value);
  if (option) {
    return option.label;
  }
  return value;
}

const Message = (props: IMessage) => {
  const { message } = props;
  const theme = useContext(ThemeContext) as { input: typeof InputTokens };
  const messageAppearance =
    (theme?.input?.message?.appearance as ITextAppearance) ||
    InputTokens.message.appearance;

  return (
    <Stack alignItems="center" gap="4px" margin="4px 0 0 16px">
      <Icon
        appearance={messageAppearance}
        icon={<MdOutlineError />}
        size="14px"
      />
      <Text
        type="body"
        size="small"
        appearance={messageAppearance}
        textAlign="start"
      >
        {message}
      </Text>
    </Stack>
  );
};

const SelectUI = forwardRef((props: ISelectInterface, ref) => {
  const {
    displayList,
    disabled,
    focused,
    fullwidth,
    handleClear,
    id,
    invalid,
    label,
    maxItems,
    message,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onOptionClick,
    options,
    placeholder,
    readOnly,
    required,
    size,
    value,
    onKeyUp,
    picker,
    checkedItems,
    onCheckboxChange,
  } = props;

  const theme = useContext(ThemeContext) as { input: typeof InputTokens };
  const requiredAppearance =
    (theme?.input?.required?.appearance as ITextAppearance) ||
    InputTokens.required.appearance;

  const displayValue = picker
    ? options
        .filter((option) => checkedItems.includes(option.id))
        .map((option) => option.label)
        .join(", ")
    : getOptionLabel(options, value);

  return (
    <StyledContainer $fullwidth={fullwidth} disabled={disabled} ref={ref}>
      {label && (
        <Stack
          alignItems="center"
          margin="0 0 4px 0"
          padding="0 0 0 16px"
          gap="4px"
        >
          <Label
            htmlFor={id!}
            focused={focused}
            invalid={invalid}
            size={getTypo(size!)}
            margin="0px 0px 0px 2px"
            disabled={disabled}
          >
            {label}
          </Label>

          {required && !disabled && (
            <Text
              type="body"
              size="small"
              appearance={requiredAppearance}
              textAlign="start"
            >
              (Requerido)
            </Text>
          )}
        </Stack>
      )}
      <StyledInputContainer
        disabled={disabled}
        $focused={focused}
        $invalid={invalid}
        onClick={onClick}
        $value={value}
        $size={size}
      >
        <StyledInput
          autoComplete="off"
          value={displayValue}
          name={name}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          $size={size}
          $fullwidth={fullwidth}
          $focused={focused}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          onClick={onClick}
          onKeyUp={onKeyUp}
          readOnly={readOnly}
        />
        <Stack direction="row" gap="8px" alignItems="center">
          {(value || (picker && checkedItems.length > 0)) && !disabled && (
            <Icon
              appearance="gray"
              icon={<MdOutlineCancel />}
              size="16px"
              onClick={handleClear}
            />
          )}

          <StyledChevron $displayList={displayList}>
            <Icon
              appearance="dark"
              icon={<MdOutlineChevronRight />}
              spacing="narrow"
              disabled={disabled}
            />
          </StyledChevron>
        </Stack>
      </StyledInputContainer>

      {invalid && <Message message={message} />}
      {displayList && !disabled && (
        <OptionList
          maxItems={maxItems}
          onOptionClick={onOptionClick}
          options={options}
        >
          {options.map((optionItem) => (
            <OptionItem
              key={optionItem.id}
              id={optionItem.id}
              label={optionItem.label}
              checked={checkedItems.includes(optionItem.id)}
              onCheckboxChange={onCheckboxChange}
              picker={picker}
            />
          ))}
        </OptionList>
      )}
    </StyledContainer>
  );
});

export { SelectUI };
export type { ISelectInterface };
