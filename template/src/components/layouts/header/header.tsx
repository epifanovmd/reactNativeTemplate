import React, { ChangeEvent, FC, memo } from "react";
import styled from "styled-components/native";
import { useModal } from "../../../common/hooks/useModal";
import { useTranslation } from "../../../common/hooks/useTranslation";

export const Header: FC = memo(() => {
  const { t, i18n } = useTranslation();
  const [open, onOpen, onClose] = useModal();

  const changeLang = async (value: "ru" | "en") => {
    await i18n.changeLanguage(value);
  };

  return (
    <HeaderWrap>
      <Items>Header1</Items>
      <Button title={t("openModal")} onPress={onOpen} />

      <Button
        title={"EN"}
        onPress={() => {
          changeLang("en");
        }}
      />
      <Button
        title={"RU"}
        onPress={() => {
          changeLang("ru");
        }}
      />

      <Text>{t("users")}</Text>

      <TextInput />
      <Switch />
      <Modal animated={true} visible={open}>
        <Button title={"Закрыть модалку"} onPress={onClose} />
      </Modal>
    </HeaderWrap>
  );
});

const HeaderWrap = styled.View`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

const Items = styled.Text`
  text-align: center;
`;
const Button = styled.Button``;
const TextInput = styled.TextInput`
  background: antiquewhite;
`;
const Switch = styled.Switch``;
const Modal = styled.Modal``;
const Text = styled.Text``;
