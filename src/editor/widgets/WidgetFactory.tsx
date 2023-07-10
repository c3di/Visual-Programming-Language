import React from 'react';
import {
  BooleanInput,
  EnumSelect,
  NumberInput,
  TextInput,
  IntegerInput,
} from './Widgets';
import { DataTypes } from '.././types';
import { stringArrayToObject } from '.././util';
import { type WidgetProps } from './WidgetProps';

export class WidgetFactory {
  private static instance: WidgetFactory;
  private readonly defaultWidgetProps: WidgetProps = {
    value: undefined,
    onChange: (value: any): void => {
      console.log('WidgetFactory.onChange', value);
    },
  };

  private readonly _availableWidgets: Record<string, JSX.Element> = {
    IntegerInput: <IntegerInput {...this.defaultWidgetProps} />,
    NumberInput: <NumberInput {...this.defaultWidgetProps} />,
    TextInput: <TextInput {...this.defaultWidgetProps} />,
    BooleanInput: <BooleanInput {...this.defaultWidgetProps} />,
    EnumSelect: <EnumSelect {...this.defaultWidgetProps} />,
  };

  private constructor() {}

  public static getInstance(): WidgetFactory {
    if (!WidgetFactory.instance) {
      WidgetFactory.instance = new WidgetFactory();
    }

    return WidgetFactory.instance;
  }

  get availableWidgets(): Record<string, JSX.Element> {
    return this._availableWidgets;
  }

  // cloneElement is used to create a new React element using an existing element as the starting point.
  // cloneElement is faster then createElement because it doesn’t need to create a new object from scratch.
  // The resulting element will have the original element’s props with the new props merged in shallowly.
  public registerWidget(widgetType: string, widget: JSX.Element): void {
    if (this._availableWidgets[widgetType])
      console.warn(`Widget type ${widgetType} is already registered.`);
    this._availableWidgets[widgetType] = widget;
  }

  public createWidget(type: string, widgetOptions: any): JSX.Element {
    if (!DataTypes[type]) {
      console.warn(`Invalid data type ${type}, return <></> element.`);
      return <></>;
    }
    const widgetTypeToUse = DataTypes[type].widget || type;
    const options = DataTypes[type].options || {};
    const widget = this._availableWidgets[widgetTypeToUse];
    if (widget) {
      return React.cloneElement(widget, { ...widgetOptions, options });
    } else {
      console.warn(`Invalid widget type, return <></> element.`);
      return <></>;
    }
  }

  public createSelectorWidget(widgetOptions: any): JSX.Element {
    const widget = this._availableWidgets.EnumSelect;
    const options = stringArrayToObject(Object.keys(DataTypes));
    return React.cloneElement(widget, { ...widgetOptions, options });
  }
}

const widgetFactory = WidgetFactory.getInstance();
export default widgetFactory;
