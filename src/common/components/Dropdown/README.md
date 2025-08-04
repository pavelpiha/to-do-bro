# Dropdown Component

A reusable dropdown component for consistent UI across the application.

## Usage

```jsx
import Dropdown from '../../common/components/Dropdown';

const MyComponent = () => {
  const options = [
    { label: 'Header Section', value: 'header', isHeader: true },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Disabled Option', value: 'disabled', disabled: true },
  ];

  const handleSelect = option => {
    console.log('Selected:', option);
  };

  return (
    <Dropdown
      options={options}
      value='option1'
      onSelect={handleSelect}
      placeholder='Choose an option'
      icon='🕐'
      className='my-custom-dropdown'
      disabled={false}
    />
  );
};
```

## Props

- `options` (array, required): Array of option objects
  - `label` (string): Display text
  - `value` (string): Unique identifier
  - `isHeader` (boolean): Makes item a non-selectable header
  - `disabled` (boolean): Makes item non-selectable
- `value` (string): Currently selected value
- `onSelect` (function, required): Callback when option is selected
- `placeholder` (string): Text shown when no option selected
- `icon` (node): Icon to display in trigger
- `className` (string): Additional CSS classes
- `disabled` (boolean): Disables the entire dropdown

## Features

- Click outside to close
- Keyboard navigation support
- Accessible ARIA attributes
- Consistent styling across the app
- Support for headers and disabled options
- Smooth animations
- Custom scrollbar styling
