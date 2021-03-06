import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { observable, action, trace, } from 'mobx';
import { observer, Observer } from 'mobx-react';

import ReactResizeDetector from 'react-resize-detector';
const SwiperComponent = require('react-id-swiper').default;

import { App } from '../App';
import { StandBar } from '../share/Progress_bar';

import * as common from './common';
import { ToggleBtn } from '@common/component/button';

interface IBallon {
	readonly brdThick: number;
	readonly bgColor: IRGBA;
	brdColor: IRGBA;
	readonly shadowX: number;
	readonly shadowY: number;
	readonly shadowBlur: number;
	readonly shadowColor: IRGBA;
}
const _brd_focus = _RGBA(255, 250, 23, 1);
const _bg_normal = _RGBA(0, 0, 0, 0.2);
const _brdThick = 2;
const _brdThick_focus = b_ls_comprehension_s ? 4 : 2; 

const _bgA = _RGBA(150, 40, 202, 1);
const _bgB = _RGBA(0, 42, 227, 1);
const _bgC = _RGBA(193, 55, 169, 1);
const _bgD = _RGBA(255, 114 ,0 , 1);
const _bgE = _RGBA(0, 146, 238, 1);

const _strokA = _RGBA(150, 40, 202, 1);
const _strokB = _RGBA(0, 42, 227, 1);
const _strokC = _RGBA(193, 55, 169, 1);
const _strokD = _RGBA(255, 114, 0, 1);
const _strokE = _RGBA(0, 146, 238, 1);

const _focusA: IBallon = {
	brdThick: _brdThick_focus,
	bgColor: _bgA,
	brdColor: _brd_focus,
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 0,
	shadowColor: _brd_focus,
};
const _focusB: IBallon = {
	brdThick: _brdThick_focus,
	bgColor: _bgB,
	brdColor: _brd_focus,
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 0,
	shadowColor: _brd_focus,
};
const _focusC: IBallon = {
	brdThick: _brdThick_focus,
	bgColor: _bgC,
	brdColor: _brd_focus,
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 0,
	shadowColor: _brd_focus,
};
const _focusD: IBallon = {
	brdThick: _brdThick_focus,
	bgColor: _bgD,
	brdColor: _brd_focus,
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 0,
	shadowColor: _brd_focus,
};
const _focusE: IBallon = {
	brdThick: _brdThick_focus,
	bgColor: _bgE,
	brdColor: _brd_focus,
	shadowX: 0,
	shadowY: 0,
	shadowBlur: 0,
	shadowColor: _brd_focus,
};
const _normal: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _RGBA(255, 255, 255, 1),
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};
const _normalA: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _strokA,
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};
const _normalB: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _strokB,
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};
const _normalC: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _strokC,
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};
const _normalD: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _strokD,
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};
const _normalE: IBallon = {
	brdThick: _brdThick,
	bgColor: _bg_normal,
	brdColor: _strokE,
	shadowX: 2,
	shadowY: 6,
	shadowBlur: 10,
	shadowColor: _RGBA(0, 0, 0, 0.2),
};

let _isBtnStudent = false;
let _downIdx = -1;
let _downX = Number.MIN_VALUE;
let _downY = Number.MIN_VALUE;

interface IScriptBox {
	view: boolean;
	script: common.IScript;
	image_s: string;
	idx: number;
	focus: boolean;
	selected: boolean;
	numOfReturn: number;
	roll: 'A' | 'B' | 'C' | 'D' | 'E';
	sroll: ''|'A'|'B';				// 현재 학습 roll
	shadowing: boolean;
	clickThumb: (idx: number, script: common.IScript) => void;
	clickText?: (idx: number, script: common.IScript) => void;
	qnaReturnsClick?: (idx: number) => void;

	compDiv: 'COMPREHENSION'|'DIALOGUE';
	viewClue: boolean;
	viewScript: boolean;
	viewTrans: boolean;
}

@observer
class ScriptBox  extends React.Component<IScriptBox> {
	private m_canvas!: HTMLCanvasElement;
	private m_ctx!: CanvasRenderingContext2D;
	private m_width = 0;
	private m_height = 0;

	private m_jsx: JSX.Element;
	private m_trans: JSX.Element;

	private m_clue: JSX.Element;
	private m_prog: JSX.Element;

	@observable private m_viewScript = true;

	constructor(props: IScriptBox) {
		super(props);
		let sScript =  props.script.dms_eng;
		sScript = sScript.replace(/<\s*br\s*\/*\s*>/ig, '<br>');
		let arrLine = sScript.split('<br>');

		this.m_jsx = (
			<>
				{arrLine.map((sLine, idx) => {
					const arr = sLine.split(' ');

					const jsx = arr.map((word, widx) => {
						if(widx === 0) return (<span key={idx + '_' + widx} className="block">{word}</span>);
						else return (<React.Fragment key={idx + '_' + widx}><span className="space">{' '}</span><span className="block">{word}</span></React.Fragment>);
					});

					if(idx === 0) return jsx;
					else return (<React.Fragment key={idx}><br/>{jsx}</React.Fragment>);
				})}
			</>
		);

		sScript =  props.script.dms_kor[App.lang];
		sScript = sScript.replace(/<\s*br\s*\/*\s*>/ig, '<br>');
		arrLine = sScript.split('<br>');

		this.m_trans = (
			<>
				{arrLine.map((sLine, idx) => {
					const arr = sLine.split(' ');

					const jsx = arr.map((word, widx) => {
						if(widx === 0) return (<span key={idx + '_' + widx} className="block">{word}</span>);
						else return (<React.Fragment key={idx + '_' + widx}><span className="space">{' '}</span><span className="block">{word}</span></React.Fragment>);
					});

					if(idx === 0) return jsx;
					else return (<React.Fragment key={idx}><br/>{jsx}</React.Fragment>);
				})}
			</>
		);

		if(props.script.qnums && props.script.qnums.length > 0) {
			this.m_clue = (
				<div className="clue_qnum">{
					props.script.qnums.map((qnum, idx) => {
						return <span key={idx} className={'qnum' + qnum}>{qnum}</span>;
					})
				}</div>
			);
		} else {
			this.m_clue = <></>;
		}


		this.m_prog = <StandBar percent={this.props.script.app_preview} />;
		// else this.m_prog = <></>;
	}

	private _draw() {
		if(!this.m_canvas || this.m_width === 0 || this.m_height === 0) return;
		this.m_ctx.clearRect(0, 0, this.m_canvas.width, this.m_canvas.height);
		this.m_canvas.width = this.m_width + 15;
		this.m_canvas.height = this.m_height + 20;

		if(!this.props.view || (this.props.compDiv !== 'DIALOGUE' && !b_ls_comprehension_s)) return;

		const props = this.props;
		let skin: IBallon;
		if(props.focus || props.selected) {
			if(props.roll === 'A') {
				skin = _focusA;

				/*
				if(props.sroll === 'A' || props.shadowing || props.selected) skin.brdColor = _brd_focus;
				else skin.brdColor = _strokA;			
				*/
				skin.brdColor = _strokA;
			} else if(props.roll === 'B') {
                skin = _focusB;
                /*
                if(props.sroll === 'B' || props.shadowing || props.selected) skin.brdColor = _brd_focus;
                else skin.brdColor = _strokB;
                */
                skin.brdColor = _strokB;
            } else if(props.roll === 'C') {
                skin = _focusC;
                /*
                if(props.sroll === 'B' || props.shadowing || props.selected) skin.brdColor = _brd_focus;
                else skin.brdColor = _strokB;
                */
                skin.brdColor = _strokC;
            } else if(props.roll === 'D') {
                skin = _focusD;
                /*
                if(props.sroll === 'B' || props.shadowing || props.selected) skin.brdColor = _brd_focus;
                else skin.brdColor = _strokB;
                */
                skin.brdColor = _strokD;
			} else {
				skin = _focusE;
				/*
				if(props.shadowing || props.selected) skin.brdColor = _brd_focus;
				else skin.brdColor = _strokC;
				*/
				skin.brdColor = _strokE;
			}
		} else {
			if(props.roll === 'A') {
				skin = _normalA;
			} else if(props.roll === 'B') {
				skin = _normalB;
			} else if(props.roll === 'C') {
				skin = _normalC;
			} else if(props.roll === 'D') {
				skin = _normalD;
			} else {
				skin = _normalE;
			}
		}

		

		let brdR;  // 코너 각
		let left;	// 좌측 면
		let top;	// 상단 면
		let px;    // 꼭지점 x위치
		let py;    // 꼭지점 x위치
		if(b_ls_comprehension_s) {
			left = 16;
			top = 10;
			brdR = 20;
			px = 2;
			py = 58;
		} else {
			left = 12;
			brdR = 10;
			top = 10;
			px = 2;
			py = 38;
		}
		_drawBalloon(
			this.m_ctx,
			left, top, this.m_width - left - 1, this.m_height,
			px, py, brdR, 
			skin, 
		);
	}
	public _refCanvas = (el: HTMLCanvasElement|null) => {
		if(this.m_ctx || !el) return;
		this.m_canvas = el;
		this.m_ctx = el.getContext('2d') as CanvasRenderingContext2D;

		this._draw();
	}

	private _onResize = (w: number, h: number) => {
		if(this.m_width === w && this.m_height === h) return;
		else if(!this.m_ctx) return;
		this.m_width = w;
		this.m_height = h;
		this._draw();
	}
	public componentDidUpdate(prev: IScriptBox) {
		if(
			this.props.focus !== prev.focus || 
			this.props.selected !== prev.selected ||
			this.props.view !== prev.view || 
			this.props.compDiv !== prev.compDiv || 
			this.props.viewTrans !== prev.viewTrans ||
			this.props.sroll !== prev.sroll ||
			this.props.shadowing !== prev.shadowing	
		) {
			_downIdx = -1;
			_downX = Number.MIN_VALUE;
			_downY = Number.MIN_VALUE;

			this._draw();
		}
		if(b_ls_comprehension_s) this.m_viewScript = true;
		else {
			if(this.props.viewScript !== prev.viewScript) {
				this.m_viewScript = this.props.viewScript;
			}
			if(this.props.compDiv !== prev.compDiv) {
				this.m_viewScript = this.props.compDiv === 'COMPREHENSION';
			}
		}
	}
	private _onClickThumb = (ev: React.MouseEvent<HTMLElement>) => {
		this.props.clickThumb(this.props.idx, this.props.script);
	}



	private _onTextDown = (ev: React.MouseEvent<HTMLElement>) => {
		const tgt = ev.target as HTMLElement;
		_isBtnStudent = (tgt && tgt.classList.contains('btn_student'));
		_downIdx = this.props.idx;
		_downX = ev.clientX;
		_downY = ev.clientY;
	}
	private _onTextUp = (ev: React.MouseEvent<HTMLElement>) => {
		const isClick = _downIdx === this.props.idx &&
						Math.abs(_downX - ev.clientX) < 30 &&
						Math.abs(_downY - ev.clientY) < 30;

		_downIdx = -1;
		_downX = Number.MIN_VALUE;
		_downY = Number.MIN_VALUE;

		if(!isClick) return;

		if(b_ls_comprehension_s) {
			if(this.props.clickText) this.props.clickText(this.props.idx, this.props.script);
		} else {
			if(this.props.compDiv === 'DIALOGUE') {
				App.pub_playBtnTab();
				this.m_viewScript = !this.m_viewScript;
			} else if(_isBtnStudent && this.props.qnaReturnsClick) {
				this.props.qnaReturnsClick(this.props.idx);
			} 
			
			// else this.props.clickThumb(this.props.idx, this.props.script);
		}		
	}
	private _onTextCancel = (ev: React.MouseEvent<HTMLElement>) => {
		_downIdx = -1;
		_downX = Number.MIN_VALUE;
		_downY = Number.MIN_VALUE;
	}

	public render()	{
		const {script, roll, sroll, focus, viewClue, viewTrans, shadowing, numOfReturn} = this.props;
		const arr: string[] = ['roll' + roll];

		if(b_ls_comprehension_s) arr.push('student');
		else arr.push('teacher');

		if(this.props.selected) arr.push('focus'); 
		
		let isViewClue;
		
		if(viewClue && script.qnums && script.qnums.length > 0) {
			arr.push('clue qnum' + script.qnums[0]);
			isViewClue = true;
		} else isViewClue = false;

		if(!this.m_viewScript) arr.push('hide-script');	
		if(sroll !== '' && sroll === roll) {
			arr.push('in-roll');
			if(focus) arr.push('on-roll');
		}
		
		if(focus && shadowing) arr.push('shadowing');
		let jsx;
		if(viewTrans) jsx = this.m_trans;
		else jsx = this.m_jsx;	

		// console.log('viewTrans', viewTrans, 'viewScript', viewScript);

		const cname = arr.join(' ');

		// console.log(cname);
		return (
			<>
				<div className={'thumb ' + cname} onClick={this._onClickThumb}>
					<div className="progress">{this.m_prog}</div>
					<img className="img_cls" src={App.data_url + this.props.image_s} draggable={false}/>
					<div className="img_cls"/>
					<span/>
				</div>
				<div 
					className={'ballon ' + cname} 
					onPointerDown={this._onTextDown} 
					onPointerUp={this._onTextUp}
					onPointerCancel={this._onTextCancel}
					onPointerLeave={this._onTextCancel}
				>
					<canvas ref={this._refCanvas}/>
					<span className={viewTrans ? 'view-trans' : ''}>
						<span>{jsx}</span>
						<div className="student-clue">
							<ToggleBtn className={'btn_student' + (isViewClue ? '' : ' single')} view={numOfReturn > 0}>{numOfReturn}</ToggleBtn>
							{this.m_clue}
						</div>
					</span>
					
					<ReactResizeDetector handleHeight={true} handleWidth={true} onResize={this._onResize}/>
				</div>
			</>
		);
	}
}

interface IRGBA {
	r: number;
	g: number;
	b: number;
	a: number;
}
function _RGBA(r: number, g: number, b: number, a: number) {
	return {r, g, b, a};
}
function _rgbaToString(rgba: IRGBA) {
	const {r, g, b, a} = rgba;
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function _drawBalloon(
	ctx: CanvasRenderingContext2D, 
	x: number, 
	y: number, 
	w: number, 
	h: number, 
	px: number,
	py: number, 
	r: number,
	skin: IBallon,

	min_gap: number = 10, 
	r_gap: number = 0.2,
) {
	const { brdThick, brdColor, bgColor, shadowX, shadowY, shadowBlur, shadowColor} = skin;

	// const hgap = Math.min(w - 2 * r, Math.max(min_gap, w * r_gap));
	// const left = (px <= x + w / 2) ? (Math.max(x + r, px)) : (Math.min(x + w - r - hgap, px - hgap));
	// const right = (px <= (x + w / 2)) ? (Math.max(x + r + hgap, px + hgap)) : (Math.min(x + w - r, px));
	
	let vgap = (x - px) * 1.8;


	const bShadow = ((shadowX !== 0 || shadowY !== 0 || shadowBlur > 0) && shadowColor.a > 0);

	let bgAlpha = bgColor.a;
	if (bShadow && bgAlpha < 1) bgColor.a = 1;
	
	ctx.lineWidth = brdThick;
	ctx.lineCap = 'butt';
	ctx.lineJoin = 'miter';
	ctx.strokeStyle = _rgbaToString(brdColor);
	ctx.fillStyle = _rgbaToString(bgColor);

	ctx.beginPath();
	/* 우측 하단 라운드 */
	ctx.moveTo(x + w, y + h - r);
	if(r > 0) ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
	
	/* 하단 선, 좌측 하단 라운드 */
	ctx.lineTo(x + r, y + h);
	if (r > 0) ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);

	/* 좌측 선(꼭지점), 좌측 상단 라운드 */
	// console.log(h, py, vgap);
	ctx.lineTo(x, py + vgap / 2);
	ctx.lineTo(px, py);
	ctx.lineTo(x, py - vgap / 2);
	ctx.lineTo(x, y + r);
	if (r > 0) ctx.arc(x + r, y + r, r, Math.PI , 3 * Math.PI / 2);

	/* 상단 선, 우측 상단 라운드 */
	ctx.lineTo(x + w - r, y);
	if (r > 0) ctx.arc(x + w - r, y + r, r, 3 * Math.PI / 2 , 2 * Math.PI);
	
	ctx.closePath();
	
	if (bShadow) {
		ctx.shadowColor = _rgbaToString(shadowColor);
		ctx.shadowBlur = shadowBlur;
		ctx.shadowOffsetX = shadowX;
		ctx.shadowOffsetY = shadowY;
		

		ctx.fill();

		if (bgAlpha < 1) {
			ctx.globalCompositeOperation = 'destination-out';
			ctx.shadowColor = 'rgba(0, 0, 0, 0)';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.fill();
			if (brdThick > 0) ctx.stroke();

			ctx.globalCompositeOperation = 'source-over';
			bgColor.a = bgAlpha;
			ctx.fillStyle = _rgbaToString(bgColor);
			
			ctx.fill();
			if (brdThick > 0) ctx.stroke();
			
		} else if(brdThick > 0) {
			ctx.shadowColor = 'rgba(0, 0, 0, 0)';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.stroke();
		}
	} else {
		ctx.fill();		
		if (brdThick > 0) ctx.stroke();	
	}
	ctx.globalCompositeOperation = 'source-over';
}

interface IScriptContainer {
	data: common.IData;
	focusIdx: number;
	selected: number[];
	qnaReturns: common.IQnaReturn[];
	clickThumb: (idx: number, script: common.IScript) => void;
	clickText?: (idx: number, script: common.IScript) => void;
	qnaReturnsClick?: (idx: number) => void;
	view: boolean;
	roll: ''|'A'|'B';
	shadowing: boolean;
	noSwiping: boolean;
	compDiv: 'COMPREHENSION'|'DIALOGUE';
	viewClue: boolean;
	viewScript: boolean;
	viewTrans: boolean;
	numRender?: number;
}

@observer
class ScriptContainer extends React.Component<IScriptContainer> {
	private m_soption: SwiperOptions = {
		direction: 'vertical',
		observer: true,
		slidesPerView: 'auto',
		freeMode: true,
		mousewheel: true,			
		noSwiping: false,
		followFinger: true,
		noSwipingClass: 'swiper-no-swiping',
		scrollbar: {el: '.swiper-scrollbar',draggable: true, hide: false},		
	};
	private m_swiper!: Swiper;

	private _refSwiper = (el: SwiperComponent) => {
		if(this.m_swiper || !el) return;
		this.m_swiper = el.swiper;

	}
	public scrollTo(fidx: number, dur?: number) {
		fidx = fidx - 1;
		if(fidx < 0) fidx = 0;
		this.m_swiper.slideTo(fidx, dur);
	}
	public componentDidUpdate(prev: IScriptContainer) {
		// console.log(this.props.selected);
		if(!this.m_swiper) return;
		
		let bUpdate = false;
		
		if(prev.focusIdx !== this.props.focusIdx && this.props.focusIdx >= 0) {
			let fidx = this.props.focusIdx - 1;
			if(fidx < 0) fidx = 0;
			this.m_swiper.slideTo(fidx);
		}
		if(this.props.view !== prev.view) {
			bUpdate = true;
			this.m_swiper.slideTo(0, 0);
		}
		if(this.props.compDiv !== prev.compDiv) {
			bUpdate = true;
			this.m_swiper.slideTo(0, 0);
		}
		if(this.props.roll !== prev.roll && this.props.roll !== '') {
			bUpdate = true;
			this.m_swiper.slideTo(0);
		}
		if(this.props.shadowing && !prev.shadowing) {
			bUpdate = true;
			this.m_swiper.slideTo(0);
		}		
		if(this.props.noSwiping !== prev.noSwiping) {
			bUpdate = true;
			this.m_soption.noSwiping = this.props.noSwiping;
			this.m_swiper.params.noSwiping = this.props.noSwiping;
			this.m_soption.followFinger = !this.props.noSwiping;
			this.m_swiper.params.followFinger = !this.props.noSwiping;
			
			if(this.m_soption.scrollbar) this.m_soption.scrollbar.draggable = !this.props.noSwiping;
			if(this.m_swiper.params.scrollbar) this.m_swiper.params.scrollbar.draggable = !this.props.noSwiping;
			
			if(this.props.noSwiping) {
				this.m_soption.noSwipingClass = 'swiper-wrapper';
				this.m_swiper.params.noSwipingClass = 'swiper-wrapper';
			} else {
				this.m_soption.noSwipingClass = 'swiper-no-swiping';
				this.m_swiper.params.noSwipingClass = 'swiper-no-swiping';				
			}
		}
		let tidx = -1;
		if(this.props.viewTrans !== prev.viewTrans) {
			if(!this.props.noSwiping) tidx = this.m_swiper.activeIndex;
			bUpdate = true;
		}
		if(this.props.viewClue && !prev.viewClue) {
            bUpdate = true;
            if(tidx <= 0) {
                const scripts = this.props.data.scripts;
                for(let i = 0; i < scripts.length; i++) {
                    if(scripts[i].qnums !== undefined && scripts[i].qnums!.length > 0) {
                        if(scripts[i].qnums!.indexOf(1) >= 0) {
                            if(i > 1) tidx = i - 1;
                            else tidx = 0;
                            break;
                        } 
                    }
                }
            }
        }
		// console.log(tidx, this.m_swiper.activeIndex);

		if(bUpdate && this.props.view) {
			this.m_swiper.update();
			if(this.m_swiper.scrollbar) this.m_swiper.scrollbar.updateSize();
			if(tidx >= 0) {
				this.m_swiper.slideTo(tidx, 0);
			}
		}
	}
	public render() {
		const { data, selected, qnaReturns } = this.props;
		const thumbA = data.speakerA.image_s;
		const thumbB = data.speakerB.image_s;
		const thumbC = data.speakerC.image_s;
		const thumbD = data.speakerD.image_s;
		const thumbE = data.speakerE.image_s;

		const arr: string[] = ['script_box'];

		if(b_ls_comprehension_s) {
			arr.push('student');
			arr.push('DIALOGUE');
		} else {
			arr.push(this.props.compDiv);
		}

		
		const boxClass = arr.join(' ');
		return (
			<>
			<SwiperComponent {...this.m_soption} ref={this._refSwiper}>
				{data.scripts.map((script, idx) => {
					let thumb;
					if (script.roll === 'E')  thumb = thumbE;
					else if (script.roll === 'D')  thumb = thumbD;
					else if (script.roll === 'C')  thumb = thumbC;
					else if (script.roll === 'B')  thumb = thumbB;
					else thumb = thumbA;
					const sidx = selected.indexOf(idx); 

					let numOfReturn = (idx < qnaReturns.length) ? qnaReturns[idx].num : 0;

					return (
						<div className={boxClass} key={'script_' + idx}>
							<ScriptBox  
								view={this.props.view}
								script={script} 
								image_s={thumb} 
								idx={idx}
								focus={idx === this.props.focusIdx}
								selected={sidx >= 0}
								numOfReturn={numOfReturn}
								roll={script.roll}
								sroll={this.props.roll}
								shadowing={this.props.shadowing}
								clickThumb={this.props.clickThumb}
								clickText={this.props.clickText}
								qnaReturnsClick={this.props.qnaReturnsClick}
								compDiv={this.props.compDiv}
								viewClue={this.props.viewClue}
								viewScript={this.props.viewScript}
								viewTrans={this.props.viewTrans}								
							/>
						</div>
					);
				})}
			</SwiperComponent>
			<div style={{display: 'none'}}>{this.props.numRender}</div>
			</>
		);
	}
}

export default ScriptContainer;
// export default ScriptContainer;