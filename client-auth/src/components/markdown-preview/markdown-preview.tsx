/* eslint-disable @typescript-eslint/no-explicit-any */
import { YfmStaticView } from '@gravity-ui/markdown-editor';
import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { parse, setOptions } from 'marked';

function transform(
  markdown: string,
  options: {
    allowHTML?: boolean;
    breaks?: boolean;
    plugins?: any[];
    linkify?: boolean;
    linkifyTlds?: string[];
    needToSanitizeHtml?: boolean;
  }
) {

  setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: options.breaks ?? true,
    // smartypants: true
  });

  // Преобразуем Markdown в HTML
  const html = parse(markdown);

  return {
    result: {
      html,
      meta: {}
    }
  };
}

interface MarkdownPreviewProps {
  // plugins?: any[];
  getValue: () => string;
  allowHTML?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  linkifyTlds?: string[];
  needToSanitizeHtml?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = (props) => {
  const {
    // plugins,
    getValue,
    allowHTML,
    breaks,
    linkify,
    linkifyTlds,
    needToSanitizeHtml
  } = props;

  const [html, setHtml] = useState('');
  // const [meta, setMeta] = useState<object | undefined>({});
  const divRef = useRef<HTMLDivElement>(null);


  const safeSetHtml = (value: string | Promise<string>) => {
    if (value instanceof Promise) {
      value.then(resolvedValue => setHtml(resolvedValue));
    } else {
      setHtml(value);
    }
  };

  const render = useMemo(
    () => debounce(async () => {
      try {
        const res = await transform(getValue(), {
          allowHTML,
          breaks,
          // plugins,
          linkify,
          linkifyTlds,
          needToSanitizeHtml,
        }).result;

        safeSetHtml(res.html);
        // setMeta(res.meta);
      } catch (error) {
        console.error('Ошибка преобразования Markdown:', error);
        setHtml('<p>Ошибка при преобразовании Markdown</p>');
        // setMeta({});
      }
    }, 200),
    [
      getValue, allowHTML, breaks,
      // plugins,
      linkify, linkifyTlds, needToSanitizeHtml]
  );

  useEffect(() => {
    render();
  }, [props, render]);

  return (
    <div>
      <YfmStaticView
        ref={divRef}
        html={html}
        // noListReset
        className="demo-preview"
      />
    </div>
  );
};

export default MarkdownPreview;
