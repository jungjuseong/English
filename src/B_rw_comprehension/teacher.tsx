import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action } from 'mobx';
import { observer, inject, Observer } from 'mobx-react';
import { hot } from 'react-hot-loader/root';
import * as _ from 'lodash';

import '../font.scss';
import './teacher.scss';

import { Navi } from '../share/navi';

import { TeacherProvider, tContext, IStateCtx, IActionsCtx, useTeacher, TeacherContext } from './teacher/t_store';
import VideoDirection from '../share/video-direction';
import { App } from '../App';
import TComprehension from './teacher/t_comprehension';


const _WIDTH = 1280;

interface ITeacher {
	state: IStateCtx;
	actions: IActionsCtx;
}

@observer
class Comp extends React.Component<ITeacher> {
	constructor(props: ITeacher) {
		super(props);



		// console.log('==>', props.actions.getData());
	}
	public render() {
		const {state, actions} = this.props;
		const viewDiv = state.viewDiv;
		return (
			<>
				<div id="preload_hidden" style={{opacity: 0}}>
					<span>가나다라abc</span><span style={{fontWeight: 'bold'}}>가나다라a</span>
					<span className="set" /> <span className="unlimit" /> <span className="start" />
					<span className="time1" /><span className="time2" /> <span className="time3" />
				</div>
				{/*
				<SVGBg 
					className="bg_svg" 
					data="/content/digenglish_lib/images/theme0_bg.svg" 
					{...state.svg_bg}
				/>
				*/}
				<div className="content-container">
					<div className="content-wrapper" style={{left: (viewDiv === 'direction' ? 0 : -_WIDTH) + 'px'}}>
						<div><VideoDirection 
							className="video-direction" 
							view={viewDiv === 'direction'} 
							on={state.directionON} 
							isTeacher={true}
							video_url={_digenglish_lib_ + 'direction/rw_comprehension.webp'}
							video_frame={125}
							onEndStart={actions.onDirectionEndStart}
							onEnd={actions.onDirectionEnded}
						>
							<div className="lesson">{App.lesson}</div>
						</VideoDirection></div>
						<div><TComprehension view={viewDiv === 'content'}  state={state} actions={actions}/></div>
					</div>
				</div>

				<Navi {...state.navi} onLeftClick={actions.naviLeft} onRightClick={actions.naviRight}/>
								
			</>
		);
	}
}
const Teacher = useTeacher((val: TeacherContext) => (
	<Observer>{() => (
		<Comp state={val.state} actions={val.actions}/>
	)}</Observer>
));

export { TeacherProvider as AppProvider, tContext as appContext };
export default hot(Teacher);
