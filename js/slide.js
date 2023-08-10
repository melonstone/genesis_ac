(function($){  // 매개변수(파라미터 Parameter)
    // 즉시표현함수는 제이쿼리 달러 사인기호의 
    // 외부 플러그인(라이브러리)와 충돌을 피하기 위해 사용하는 함수식

    // 객체(Object 오브젝트) 선언 {} : 섹션별 변수 중복을 피할 수 있다.
    // const obj = new Object(); // 객체 생성자 방식
    //       obj = {}  

    const obj = {  // 객체 리터럴 방식 권장
        init(){  // 대표 메서드
            this.header();
            this.section1();
            this.section2();
            this.section3();
        },
        header(){},
        section1(){
            let cnt=0;
            let setId=0;
            let winW = $(window).innerWidth();
            const slideContainer = $('#section1 .slide-container');
            const slideWrap = $('#section1 .slide-wrap');
            const slideView = $('#section1 .slide-view');
            const slideImg = $('#section1 .slide img');
            const pageBtn = $('#section1 .page-btn');
            const stopBtn = $('#section1 .stop-btn');
            const playBtn = $('#section1 .play-btn');
            const n = ($('#section1 .slide').length-2)-1;
            
            
            // 창너비(1903)에 대한 이미지(2560) 비율 => 2560/1903
            const imgRate = 1.3452443510246979;
            // 이미지 크기별 translateX(-음수값) => 324/2560
            // transform: translateX(-324px);
            const imgTranRate = 0.1265625;

        
            // 이미지 크기 조절 => 반응형 이미지 크기
            // 이미지 크기 조절 => 반응형 translateX
            let x = (imgRate * winW) * imgTranRate;
            slideImg.css({width: imgRate*winW, transform: `translateX(${-x}px)`});

            // console.log("슬라이드 이미지 너비 = " + slideImg.innerWidth());
            // console.log("이미지 비율  = " + imgRate);
            
            // 창 크기에 반응하는 이미지 크기와 translateX
            // 크기가 변경되면 즉각 반응
            $(window).resize(function(){
                winW = $(window).innerWidth();
                x = (imgRate * winW) * imgTranRate;
                slideImg.css({width: imgRate*winW, transform: `translateX(${-x}px)`});
                
            });








            // 0. 메인슬라이드 터치스와이프
            // 마우스다운 => 터치시작
            // 마우스업 => 터치끝
            // 화면의 왼쪽 끝이 0 ~ 오른쪽 끝이 1920
            let mouseDown = null;
            let mouseUp = null;

            // 드래그시작
            // 드래그끝
            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let sizeX = winW / 4;  // 드래그 길이

            // 슬라이드박스 좌측 끝 
            // console.log( slideWrap.offset().left );

            // 터치 스와이프 이벤트
            // 데스크탑: 마우스 터치 스와이프 이벤트
            // 데스크탑: 마우스 터치 드래그 앤 드롭
            // 태블릿 & 모바일: 손가락(핑거링) 터치 스와이프 이벤트
            // 태블릿 & 모바일: 손가락(핑거링) 드래그 앤 드롭
            // slideContainer.on({
            //     mousedown(e){
            //         winW = $(window).innerWidth(); // 마우스 다운하면 창너비 가져오기
            //         sizeX = winW / 2;
            //         mouseDown = e.clientX; 
            //         // 슬라이드랩퍼박스 좌측 좌표값 -1903
            //         // 계속 드래그시 슬라이드 박스 좌측값 설정한다.
            //         dragStart = e.clientX - (slideWrap.offset().left+winW);  // 좌측끝 0 시작
            //         mDown = true; // 1. 드래그 시작 
            //         slideView.css({ cursor: 'grabbing' }); // 잡는다 (드래그)
            //     },
            //     mouseup(e){
            //         mouseUp = e.clientX;        
                    
            //         if( mouseDown-mouseUp > sizeX ){ // 900초과 => 900 이하
            //             clearInterval(setId); // 클릭시 일시중지
            //             if(!slideWrap.is(':animated')){
            //                 nextCount();
            //             }                            
            //         }
                    
            //         if( mouseDown-mouseUp < -sizeX ){  // -900 미만 => -900이상
            //             clearInterval(setId); // 클릭시 일시중지
            //             if(!slideWrap.is(':animated')){
            //                 prevCount();
            //             }                            
            //         }

            //         // -900 >= 이상이고 <= 900 이하이면 원래대로 제자리로 찾아간다.
            //         if(  mouseDown-mouseUp >= -sizeX  &&  mouseDown-mouseUp <= sizeX ){
            //             mainSlide();
            //         }

            //         mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
            //         slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
            //     },
            //     mousemove(e){
            //         if(!mDown) return;   // 3. true가 아니면 마우스 다운이 있어야만 드래그 가능                 
            //         // if(mDown!==true) return;   // true가 아니면 마우스 다운이 있어야만 드래그 가능                 
            //         // if(mDown===false) return;   // false 이면 마우스 다운이 있어야만 드래그 가능                 
                                         
            //         dragEnd = e.clientX; // 4. 드래그 끝 좌표값
            //         slideWrap.css({left:  dragEnd-dragStart }); // 5. 슬라이드 드래그 이동 디롭( 드래그끝 좌표값 - 드래그시작 좌표값 )
            //     }
            // })

            // slideContainer 영역을 벗어나면  mouseup의 예외처리
            // 도큐먼트에서 예외처리
            $(document).on({
                mouseup(e){
                    if(!mDown) return;

                    mouseUp = e.clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }                            
                    }

                    mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
                    slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
                }
            });


            // 태블릿 & 모바일: 손가락(핑거링) 터치 스와이프 이벤트
            // 태블릿 & 모바일: 손가락(핑거링) 드래그 앤 드롭
            slideContainer.on({
                touchstart(e){
                    winW = $(window).innerWidth(); // 마우스 다운하면 창너비 가져오기
                    sizeX = winW / 4;
                    mouseDown = e.originalEvent.changedTouches[0].clientX; 
                    // 슬라이드랩퍼박스 좌측 좌표값 -1903
                    // 계속 드래그시 슬라이드 박스 좌측값 설정한다.
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left+winW);  // 좌측끝 0 시작
                    mDown = true; // 1. 드래그 시작 
                    slideView.css({ cursor: 'grabbing' }); // 잡는다 (드래그)
                },
                touchend(e){
                    mouseUp = e.originalEvent.changedTouches[0].clientX; 
                    
                    if( mouseDown-mouseUp > sizeX ){ // 900초과 => 900 이하
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){  // -900 미만 => -900이상
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }                            
                    }

                    // -900 >= 이상이고 <= 900 이하이면 원래대로 제자리로 찾아간다.
                    if(  mouseDown-mouseUp >= -sizeX  &&  mouseDown-mouseUp <= sizeX ){
                        mainSlide();
                    }

                    mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
                    slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
                },
                touchmove(e){
                    if(!mDown) return;   // 3. true가 아니면 마우스 다운이 있어야만 드래그 가능                 
                    // if(mDown!==true) return;   // true가 아니면 마우스 다운이 있어야만 드래그 가능                 
                    // if(mDown===false) return;   // false 이면 마우스 다운이 있어야만 드래그 가능                 
                                         
                    dragEnd = e.originalEvent.changedTouches[0].clientX; // 4. 드래그 끝 좌표값
                    slideWrap.css({left:  dragEnd-dragStart }); // 5. 슬라이드 드래그 이동 디롭( 드래그끝 좌표값 - 드래그시작 좌표값 )
                }
            })

            // 손가락 터치 이벤트 확인하기 
            // => 태블릿과 모바일에서만 이벤트 동작
            // originalEvent: TouchEvent
            // type: 'touchstart'
            slideContainer.on({
                touchstart(e){ // event
                    // console.log( e );
                    console.log( e.originalEvent.changedTouches[0].clientX );
                }, // mousedown
                touchend(e){
                    // console.log( e );
                    console.log( e.originalEvent.changedTouches[0].clientX );
                }, // mouseup
                touchmove(e){
                    // console.log( e );
                } // mousemove
            });



            // 1. 메인슬라이드함수
            function mainSlide(){
                slideWrap.stop().animate({left: `${-100*cnt}%`}, 600, 'easeInOutExpo', function(){
                    if(cnt>n){cnt=0}
                    if(cnt<0){cnt=n}
                    slideWrap.stop().animate({left: `${-100*cnt}%`}, 0);
                });
                pageEvent();
            }

            // 2-1. 다음카운트함수
            function nextCount(){
                cnt++;
                mainSlide();
            }
            // 2-2. 이전카운트함수
            function prevCount(){
                cnt--;
                mainSlide();
            }

            // 3. 자동타이머함수(7초 후 7초간격 계속)
            function autoTimer(){
                setId = setInterval(nextCount, 7000);
            }
            //autoTimer();

            // 4. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq( cnt>n ? 0 : cnt).addClass('on');
            }

            // 5. 페이지버튼클릭
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainSlide();
                        clearInterval(setId); // 클릭시 일시중지
                    }
                });
            });

            // 6-1. 스톱 버튼 클릭이벤트
            stopBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.addClass('on');
                    playBtn.addClass('on');
                    clearInterval(setId); // 클릭시 일시중지
                }
            })

            // 6-2. 플레이 버튼 클릭이벤트
            playBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.removeClass('on');
                    playBtn.removeClass('on');
                    autoTimer(); // 클릭시 재실행 7초후실행
                }
            })

            
        },
        section2(){
            // 0. 변수설정
            let cnt = 0;
            const slideContainer = $('#section2 .slide-container');
            const section2Container = $('#section2 .container');
            const slideWrap = $('#section2 .slide-wrap');
            const slideView = $('#section2 .slide-view');
            const slide = $('#section2 .slide-view .slide');
            const slideH3 = $('#section2 .slide-view .slide h3');
            const slideH4 = $('#section2 .slide-view .slide h4');
            const pageBtn = $('#section2 .page-btn');
            const selectBtn = $('#section2 .select-btn');
            const subMenu = $('#section2 .sub-menu');
            const materialIcons = $('#section2  .select-btn .material-icons');
            const heightRate = 0.884545392; // 너비에대한 높이 비율
            
            // 터치스와이프
            let touchStart = null;
            let touchEnd = null;

            // 드래그시작
            // 드래그끝
            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let winW = $(window).innerWidth(); // 창너비=> 슬라이드1개의 너비
            let sizeX = 100;  // 드래그 길이
            let offsetL =   slideWrap.offset().left;  // 318 
            let slideWidth;
            // slideWrap.offset().left 좌측 좌표값
            // console.log(  slideWrap.offset().left );



            resizeFn(); // 로딩시 불러오기
            // 함수는 명령어의 묶음
            function resizeFn(){
                winW = $(window).innerWidth(); // 창크기 값을 계속 보여준다.
                // 1. 창너비 1642px 이하에서 padding-left 0으로 설정
                if(winW > 1642){
                    slideWidth = (section2Container.innerWidth()-198+20+20)/3;
                }
                else{
                    // 1280 초과에서는 슬라이드 3개
                    // 1280 이하에서는 슬라이드 1개만 노출
                    if(winW > 1280){
                        slideWidth = (section2Container.innerWidth())/3;
                    }
                    else{
                    slideWidth = (section2Container.innerWidth())/1;
                    }
                }
                
                slideWrap.css({width: slideWidth*10 });
                slide.css({width: slideWidth, height: slideWidth*heightRate });
                slideH3.css({fontSize: slideWidth*0.084758371 });
                slideH4.css({fontSize: slideWidth*0.035687735 });
                mainSlide(); // 슬라이드에 슬라이드너비 전달하기 위해 호출
            }
           
            // 반응형 => 가로 세로 1px이상 크기가 변경되면 실행
            // 크기가 변경되지 않으면 실행x
            $(window).resize(function(){
                resizeFn();
            });




            // 데스크탑 터치스와이프 & 드래그앤드롭
            slideContainer.on({
                mousedown(e){
                    slideView.css({ cursor: 'grabbing' }); // 잡는다
                    mDown = true;
                    touchStart = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left-offsetL);
                },
                mouseup(e){
                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다
                    mDown = false;
                },
                mousemove(e){
                    if(!mDown) return;

                    dragEnd = e.clientX;

                    slideWrap.css({left: dragEnd - dragStart });

                }
            });    

            $(document).on({
                mouseup(e){
                    // mDown = true; 상태에서 
                    // mouseup 에서 mDown = false; 변경
                    // 그러면 이미 실행한거임
                    // 그래서 실행 못하게 막야한다.
                    if(!mDown) return; // 마우스 다운상태에서 마우스 업이 실행이 안된상태에서만 실행하라

                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    mDown = false;
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if( touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다

                }
            })


            // 태블릿&모바일 터치스와이프 & 드래그앤드롭
            slideContainer.on({
                touchstart(e){
                    slideView.css({ cursor: 'grabbing' }); // 잡는다
                    mDown = true;
                    touchStart = e.originalEvent.changedTouches[0].clientX;
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left-offsetL);
                },
                touchend(e){
                    touchEnd = e.originalEvent.changedTouches[0].clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다
                    mDown = false;
                },
                touchmove(e){
                    if(!mDown) return;

                    dragEnd = e.originalEvent.changedTouches[0].clientX;

                    slideWrap.css({left: dragEnd - dragStart });

                }
            }); 



            // 셀렉트버튼 클릭 이벤트 => 토글 이벤트
            // 셀렉트버튼 한번 클릭하면 서브메뉴 보이고
            // 셀렉트버튼 또 한번 클릭하면 서브메뉴 숨긴
            selectBtn.on({
                click(e){
                    e.preventDefault();
                    subMenu.toggleClass('on');  // 서브메뉴
                    materialIcons.toggleClass('on'); // 아이콘
                }
            })


            // 1. 메인슬라이드함수
            mainSlide();
            function mainSlide(){                
                slideWrap.stop().animate({left: -slideWidth * cnt }, 600, 'easeInOutExpo');                
                pageBtnEvent();
            }

            // 다음카운트함수
            function nextCount(){
                cnt++;
                if(cnt>7) {cnt=7};
                mainSlide();
            }

            // 이전카운트함수
            function prevCount(){
                cnt--
                if(cnt<0) {cnt=0};
                mainSlide();
            }


            // 2. 페이지버튼 클릭이벤트
            // each() 메서드
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainSlide();
                    }
                })
            });

            //  3. 페이지버튼 이벤트 함수
            function pageBtnEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq(cnt).addClass('on');
            }


        },
        section3(){},
    }
    obj.init();

})(jQuery); // 전달인수(아규먼트 Argument)
