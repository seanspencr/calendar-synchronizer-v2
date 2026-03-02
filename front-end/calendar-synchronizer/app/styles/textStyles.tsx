import { StyleProp, TextStyle } from "react-native";


export const baseText : StyleProp<TextStyle> = {
    fontFamily: "System"
}

export const h1 : StyleProp<TextStyle> = {
    ...baseText,
    fontSize: 48,
    fontWeight: "bold"
}

export const h2 : StyleProp<TextStyle> = {
    ...baseText,
    fontSize: 36,
    fontWeight: "bold"
}

export const h3 : StyleProp<TextStyle> = {
    ...baseText,
    fontSize: 24,
    fontWeight: "bold"
}

export const h4 : StyleProp<TextStyle> = {
    ...baseText,
    fontSize: 18,
    fontWeight: "bold"
}

export const body : StyleProp<TextStyle> = {
    ...baseText,
    fontSize: 14,
    fontWeight: "normal"
}

export const textInput : StyleProp<TextStyle> = {
    ...body,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
}