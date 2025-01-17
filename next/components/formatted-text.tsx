import Image from "next/image";
import Link from "next/link";
import {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import parse from "html-react-parser";
import { isRelative } from "lib/utils";

const isElement = (domNode: DOMNode): domNode is Element =>
  domNode.type === "tag";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isElement(domNode)) {
      if (domNode.name === "img") {
        const { src, alt, width = "100px", height = "100px" } = domNode.attribs;

        if (isRelative(src)) {
          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${src}`}
              width={`${width}px`}
              height={`${height}px`}
              alt={alt}
              layout="intrinsic"
              objectFit="cover"
            />
          );
        }
      }

      if (domNode.name === "a") {
        const { href, class: className } = domNode.attribs;

        if (href && isRelative(href)) {
          return (
            <Link href={href} passHref>
              <a className={className}>{domToReact(domNode.children)}</a>
            </Link>
          );
        }
      }

      if (domNode.name === "input") {
        if (domNode.attribs.value === "") {
          delete domNode.attribs.value;
        }

        return domNode;
      }
    }
  },
};

interface FormattedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  format?: string;
  processed: string;
  value?: string;
}

export function FormattedText({ processed, ...props }: FormattedTextProps) {
  return (
    <div data-cy="node--body" {...props}>
      {parse(processed, options)}
    </div>
  );
}
