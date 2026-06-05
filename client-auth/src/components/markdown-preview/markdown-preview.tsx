/* eslint-disable @typescript-eslint/no-explicit-any */
import { YfmStaticView } from '@gravity-ui/markdown-editor';
import debounce from 'lodash/debounce';
import { parse, setOptions } from 'marked';
import { useEffect, useMemo, useRef, useState } from 'react';

import style from './markdown-preview.module.css';

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
    gfm: true,
    breaks: options.breaks ?? true,
  });

  const html = parse(markdown);

  return {
    result: {
      html,
      meta: {},
    },
  };
}

interface MarkdownPreviewProps {
  getValue: () => string;
  allowHTML?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  linkifyTlds?: string[];
  needToSanitizeHtml?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = (props) => {
  const {
    getValue,
    allowHTML,
    breaks,
    linkify,
    linkifyTlds,
    needToSanitizeHtml,
  } = props;

  const [html, setHtml] = useState('');
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
          linkify,
          linkifyTlds,
          needToSanitizeHtml,
        }).result;

        safeSetHtml(res.html);
      } catch (error) {
        console.error('Ошибка преобразования Markdown:', error);
        setHtml('<p>Ошибка при преобразовании Markdown</p>');
      }
    }, 200),
    [getValue, allowHTML, breaks, linkify, linkifyTlds, needToSanitizeHtml]
  );

  useEffect(() => {
    render();
  }, [props, render]);

  return (
    <div className={style.wrapper}>
      <YfmStaticView
        ref={divRef}
        html={html}
        className="demo-preview"
      />
    </div>
  );
};

export default MarkdownPreview;
