import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { hot } from 'react-hot-loader/root';
import * as _ from 'lodash';

import * as felsocket from '../felsocket';
import { SVGBg, SVGEmbed, SVGAni } from '../share/svg_object';
import VideoDirection from '../share/video-direction';


import { sContext, StudentProvider, StudentContext, useStudent, IStateCtx, IActionsCtx } from './student/s_store';

import { Loading } from '../share/loading';

import { LikeSend } from '../share/like';

import Quiz from './student/s_quiz';
import VocaTyping from './student/s_voca_typing';
import SSpeakRecord from './student/s_speak_record';

import './student.scss';
import '../font.scss';
import { IWordData } from './common';
import { App } from '../App';

/*
@observer
class PreLoad extends React.Component<{words: IWordData[]}> {
	@observable private _loadedCnt = 0;
	private _onLoad = () => {
		this._loadedCnt++;
	}
	private _onError = () => {
		this._loadedCnt++;
	}
	public render() {
		const words = this.props.words;
		const word = words[this._loadedCnt];

		return (
			<>
				<img src={App.data_url + word.image_pad} onLoad={this._onLoad} onError={this._onError} />)}
			</>
		);
	}
}
*/
@observer
class Comp extends React.Component<{state: IStateCtx, actions: IActionsCtx}> {
	public render() {
		const {state, actions} = this.props;
		let left = state.viewDiv === 'direction' ? 0 : -1280;
		const words = actions.getWords();

		return (
			<>
			<div id="preload_hidden">
				<span>가나다라</span><span style={{fontWeight: 'bold'}}>가나다라</span>
			</div>
			<SVGBg 
				className="bg_svg" 
				data="/content/digenglish_lib/images/theme0_bg.svg" 
				{...state.svg_bg}
			/>
			<div className="content-container"><div className="content-wrapper" style={{left: left + 'px',}}>
				<div><VideoDirection 
							className="video-direction" 
							view={state.viewDiv === 'direction'} 
							on={state.directionON} 
							isTeacher={false}
							video_url={_digenglish_lib_ + 'direction/ls_rw_voca.webp'}
							video_frame={125}
				/></div>
				<div>

					<Quiz/>
					<VocaTyping />
					<SSpeakRecord />

					<Loading view={state.loading}/>
					<SVGAni 
						className="goodjob-svg" 
						view={state.goodjob} 
						delay={2000}
						data={`${_digenglish_lib_}images/goodjob_ls.svg`}
						onComplete={actions.goodjobComplete}
					/>
					<SVGEmbed 
						className="eyeon_svg" 
						data={`${_digenglish_lib_}images/eyeon_ls.svg`}
						view={state.viewDiv === 'eyeon' || state.viewDiv === 'direction'}
						bPlay={false}
					/>
				</div>
			</div></div>

			</>
		);
	}
	

}
const Student = useStudent((store: StudentContext) => (
	<Observer>{() => (
		<Comp 
			state={store.state} 
			actions={store.actions}
		/>
	)}</Observer>
));
export { StudentProvider as AppProvider, sContext as appContext };
export default hot(Student);