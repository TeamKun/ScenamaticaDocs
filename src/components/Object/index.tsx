import React from "react"
import styles from "./index.module.css"
import {ActionArgument, ScenarioType} from "@site/src/components/Action";
import Link from "@docusaurus/Link";

export type ObjectElement = {
    name: string | string[]
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
    const shouldShowRequiringState = objects.some((element) => element.required)
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
                        return <>{" "}{type.toElement()}</>
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
            availableFor = <span>
                {element.available.map((type, index) => {
                    if (index > 0)
                        return <>{" "}{type.toElement()}</>
                    else
                        return <>{type.toElement()}</>
                })}
            </span>
        }

        // <code> で name をラップ
        const nameElements = Array.isArray(name) ? name.map((name, index) => {
            if (index > 0)
                return <><code>{name}</code></>
            else
                return <code>{name}</code>
        }).reduce((prev: JSX.Element, curr: JSX.Element) => {
            return <>{prev} | {curr}</>
        }) : <code>{name}</code>

        return (
            <tr className={styles.objects} key={element.name}>
                <td>{nameElements}</td>
                <td><code>{typeName}</code></td>
                {shouldShowRequiringState ? <td className={styles.requiredStatus}>{required}</td> : null}
                <td className={styles.description}>{element.description}</td>
                {shouldShowDefaultValue ? <td className={element.default ? null: styles.none}>{element.default ? <code>{element.default}</code> : "-"}</td> : null}
                {shouldShowAvailableFor ? <td className={styles.scenarioType}>{availableFor ? availableFor : <code><span className={styles.allType}>すべて</span></code>}</td> : null}
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
                    {shouldShowRequiringState ? <th>必須？</th> : null}
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
