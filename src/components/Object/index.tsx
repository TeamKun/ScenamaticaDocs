import React from "react"
import styles from "./index.module.css"
import {ActionArgument, ScenarioType} from "@site/src/components/Action";
import Link from "@docusaurus/Link";

export type ObjectElement = {
    name: string
    anchor?: string
    required?: boolean | ScenarioType[] | string
    type: string | ObjectType
    type_anchor?: string
    type_link?: string
    description?: string
    default?: any
}

export enum ObjectType {
    OBJECT = "構造体",
    STRING = "文字列",
    INTEGER = "整数値 (32bit)",
    LONG = "整数値 (64bit)",
    FLOAT = "単精度浮動小数点数",
    DOUBLE = "倍精度浮動小数点数",
    BOOLEAN = "真偽値",
}

type ObjectsProps = {
    objects: ObjectElement[]
}

const isActionArgument = (element: ObjectElement): element is ActionArgument => {
    return "available" in element
}

export const Object: React.FC<ObjectsProps> = ({ objects }) => {
    const shouldShowDefaultValue = objects.some((element) => element.default)
    const shouldShowAvailableFor = objects.some((element) => isActionArgument(element) && element.available.length > 0)

    const elements = objects.map((element) =>{
        const name = element.anchor ? <a href={"#" + element.anchor}>{element.name}</a>: element.name
        let required: JSX.Element | null = null
        if (!element.required)
            required = <span>-</span>
        else if (typeof element.required === "string")
            required = <span className={styles.required}>{element.required}</span>
        else if (Array.isArray(element.required)) {
            required = <span className={styles.required}>
                {element.required.map((type, index) => {
                    if (index > 0)
                        return <>{" | "}{type.toElement()}</>
                    else
                        return <>{type.toElement()}</>
                })}
            </span>
        }
        else
            required = <span className={styles.required}>必須</span>

        const typeNameStr = typeof element.type === "string" ? element.type : (element.type as ObjectType)
        let typeName: string | JSX.Element = typeNameStr
        if (element.type_anchor)
            typeName = <Link to={"#" + element.type_anchor}>{typeNameStr}</Link>
        else if (element.type_link)
            typeName = <Link to={element.type_link}>{typeNameStr}</Link>

        let availableFor: JSX.Element | null = null
        if (isActionArgument(element) && element.available.length > 0) {
            for (const type of element.available) {
                if (availableFor)
                    availableFor = <>{availableFor} | {type.toElement()}</>
                else
                    availableFor = <>{type.toElement()}</>
            }
        }

        return (
            <tr className={styles.objects} key={element.name}>
                <td><code>{name}</code></td>
                <td><code>{typeName}</code></td>
                <td>{required}</td>
                <td>{element.description}</td>
                {shouldShowDefaultValue ? <td>{element.default ? <code>{element.default}</code> : "-"}</td> : null}
                {shouldShowAvailableFor ? <td>{availableFor ? availableFor : <code>ALL</code>}</td> : null}
            </tr>
        )
    })

    return (
        <>
            <table className={styles.objects}>
                <thead>
                <tr className={styles.objects + " " + styles.header}>
                    <th>キー</th>
                    <th>型</th>
                    <th>必須？</th>
                    <th>説明</th>
                    {shouldShowDefaultValue ? <th>デフォルト</th> : null}
                    {shouldShowAvailableFor ? <th>利用可能</th> : null}
                </tr>
                </thead>
                <tbody>
                {elements}
                </tbody>
            </table>
        </>
    )
}
