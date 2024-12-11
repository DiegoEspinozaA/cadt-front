import * as React from 'react';
import PropTypes from 'prop-types';
import { Select as BaseSelect } from '@mui/base/Select';
import { Option as BaseOption } from '@mui/base/Option';
import clsx from 'clsx';
import { PopupContext } from '@mui/base/Unstable_Popup';
import { CssTransition } from '@mui/base/Transitions';
import { useState } from 'react';

export default function UnstyledSelectIntroduction({ categoria, icon, options, active}) {

    const [selectedValue, setSelectedValue] = useState("Area");
    const handleChange = (event) => { setSelectedValue(event.target.value); };


    return (
        <div className="light">
            <Select defaultValue={active} >
                <Option value={"Area"} className="flex gap-2 items-center opacity-70" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-land-plot"><path d="m12 8 6-3-6-3v10" /><path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" /><path d="m6.49 12.85 11.02 6.3" /><path d="M17.51 12.85 6.5 19.15" /></svg>
                    {categoria}
                </Option>
                {options.map((option) => (
                    <Option key={option.id} value={option.id}>{option.nombre}</Option>
                ))}
            </Select>
        </div>

    );
}



const getOptionColorClasses = ({ selected, highlighted, disabled }) => {
    let classes = '';
    if (disabled) {
        classes += 'text-slate-400';
    } else {
        if (selected) {
            classes += ' bg-blue-100 text-blue-950';
        } else if (highlighted) {
            classes += ' bg-slate-100 text-slate-900';
        }
        classes +=
            ' hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-400';
    }
    return classes;
};

const Option = React.forwardRef((props, ref) => {
    return (
        <BaseOption
            ref={ref}
            {...props}
            slotProps={{
                root: ({ selected, highlighted, disabled }) => ({
                    className: `list-none p-2 rounded-lg cursor-default last-of-type:border-b-0 ${getOptionColorClasses(
                        { selected, highlighted, disabled },
                    )}`,
                }),
            }}
        />
    );
});

const Button = React.forwardRef(function Button(props, ref) {
    const { ownerState, ...other } = props;
    return (
        <button type="button" {...other} ref={ref} >
            {other.children}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>

        </button>
    );
});

Button.propTypes = {
    children: PropTypes.node,
    ownerState: PropTypes.object.isRequired,
};

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
    const { ownerState, ...other } = props;
    const popupContext = React.useContext(PopupContext);

    if (popupContext == null) {
        throw new Error(
            'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
        );
    }

    const verticalPlacement = popupContext.placement.split('-')[0];

    return (
        <CssTransition
            className={`placement-${verticalPlacement}`}
            enterClassName="open"
            exitClassName="closed"
        >
            <ul {...other} ref={ref} />
        </CssTransition>
    );
});

AnimatedListbox.propTypes = {
    ownerState: PropTypes.object.isRequired,
};

const resolveSlotProps = (fn, args) => (typeof fn === 'function' ? fn(args) : fn);

const Select = React.forwardRef(function CustomSelect(props, ref) {
    return (
        <BaseSelect
            ref={ref}
            {...props}
            slots={{
                root: Button,
                listbox: AnimatedListbox,
                ...props.slots,
            }}
            className={clsx('CustomSelect', props.className)}
            slotProps={{
                ...props.slotProps,
                root: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.root,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            `flex items-center justify-between gap-2 relative text-sm font-sans box-border w-40 px-3 py-2 rounded-lg text-left bg-white border border-solid border-slate-300 text-slate-900 transition-all hover:bg-slate-50 outline-0 shadow-md shadow-slate-100 ${ownerState.focusVisible
                                ? 'focus-visible:ring-4 ring-gray-500/30 focus-visible:border-gray-500'
                                : ''
                            }`,
                            resolvedSlotProps?.className,
                        ),
                    };
                },
                listbox: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.listbox,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            `text-sm font-sans p-1.5 my-3 w-80 rounded-xl overflow-auto outline-0 bg-white border border-solid border-slate-200 text-slate-900 shadow shadow-slate-200 [.open_&]:opacity-100 [.open_&]:scale-100 transition-[opacity,transform] [.closed_&]:opacity-0 [.closed_&]:scale-90 [.placement-top_&]:origin-bottom [.placement-bottom_&]:origin-top`,
                            resolvedSlotProps?.className,
                        ),
                    };
                },
                popup: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.popup,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx('z-10', resolvedSlotProps?.className),
                    };
                },
            }}
        />
    );
});

Select.propTypes = {
    className: PropTypes.string,
    slotProps: PropTypes.shape({
        listbox: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        popup: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    }),
    slots: PropTypes.shape({
        listbox: PropTypes.elementType,
        popup: PropTypes.elementType,
        root: PropTypes.elementType,
    }),
};
