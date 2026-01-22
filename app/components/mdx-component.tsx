
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";

const useMDXComponent = (code: string) => {
    const fn = new Function(code) 
    return fn({...runtime}).default;
}

const components  = {
    Callout,
}

interface MdxProps {
    code: string;
}

export function MDXContent({code}: MdxProps) {
    const Component = useMDXComponent(code);
    return <Component components={components} />
}