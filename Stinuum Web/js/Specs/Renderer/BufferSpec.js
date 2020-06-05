defineSuite([
        'Renderer/Buffer',
        'Core/IndexDatatype',
        'Renderer/BufferUsage',
        'Specs/createContext'
    ], function(
        Buffer,
        IndexDatatype,
        BufferUsage,
        createContext) {
    'use strict';

    createBufferSpecs({});
    var c = createContext({ requestWebgl2 : true });
    // Don't repeat WebGL 1 tests when WebGL 2 is not supported
    if (c.webgl2) {
        createBufferSpecs({ requestWebgl2 : true });
    }
    c.destroyForSpecs();

    function createBufferSpecs(contextOptions) {
        var context;
        var buffer;
        var buffer2;
        var webglMessage = contextOptions.requestWebgl2 ? ': WebGL 2' : '';

        beforeAll(function() {
            context = createContext(contextOptions);
        });

        afterAll(function() {
            context.destroyForSpecs();
        });

        afterEach(function() {
            if (buffer && !buffer.isDestroyed()) {
                buffer = buffer.destroy();
            }
            if (buffer2 && !buffer2.isDestroyed()) {
                buffer2 = buffer2.destroy();
            }
        });

        it('throws when creating a vertex buffer with no context' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    sizeInBytes : 4,
                    usage : BufferUsage.STATIC_DRAW
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating a vertex buffer with an invalid typed array' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    context : context,
                    typedArray : {},
                    usage : BufferUsage.STATIC_DRAW
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating a vertex buffer with both a typed array and size in bytes' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    context : context,
                    typedArray : new Float32Array([0, 0, 0, 1]),
                    sizeInBytes : 16,
                    usage : BufferUsage.STATIC_DRAW
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating a vertex buffer without a typed array or size in bytes' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    context : context,
                    usage : BufferUsage.STATIC_DRAW
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating a vertex buffer with invalid usage' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    context : context,
                    sizeInBytes : 16,
                    usage : 0
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating a vertex buffer with size of zero' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createVertexBuffer({
                    context : context,
                    sizeInBytes : 0,
                    usage : BufferUsage.STATIC_DRAW
                });
            }).toThrowDeveloperError();
        });

        it('creates vertex buffer' + webglMessage, function() {
            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 16,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(buffer.sizeInBytes).toEqual(16);
            expect(buffer.usage).toEqual(BufferUsage.STATIC_DRAW);
        });

        it('copies array to a vertex buffer' + webglMessage, function() {
            var sizeInBytes = 3 * Float32Array.BYTES_PER_ELEMENT;
            var vertices = new ArrayBuffer(sizeInBytes);
            var positions = new Float32Array(vertices);
            positions[0] = 1.0;
            positions[1] = 2.0;
            positions[2] = 3.0;

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : sizeInBytes,
                usage : BufferUsage.STATIC_DRAW
            });
            buffer.copyFromArrayView(vertices);
        });

        it('can create a vertex buffer from a typed array' + webglMessage, function() {
            var typedArray = new Float32Array(3);
            typedArray[0] = 1.0;
            typedArray[1] = 2.0;
            typedArray[2] = 3.0;

            buffer = Buffer.createVertexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW
            });
            expect(buffer.sizeInBytes).toEqual(typedArray.byteLength);
            expect(buffer.usage).toEqual(BufferUsage.STATIC_DRAW);
        });

        it('can create a vertex buffer from a size in bytes' + webglMessage, function() {
            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            expect(buffer.sizeInBytes).toEqual(4);
            expect(buffer.usage).toEqual(BufferUsage.STATIC_DRAW);
        });

        it('throws when creating an index buffer with no context' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    sizeInBytes : 4,
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer with an invalid typed array' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    typedArray : {},
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer with both a typed array and size in bytes' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    typedArray : new Uint16Array([0, 1, 2, 0, 2, 3]),
                    sizeInBytes : 12,
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer without a typed array or size in bytes' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer with invalid usage' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    sizeInBytes : 16,
                    usage : "invalid",
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer with invalid index data type' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    sizeInBytes : 16,
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : 'invalid'
                });
            }).toThrowDeveloperError();
        });

        it('throws when creating an index buffer with size of zero' + webglMessage, function() {
            expect(function() {
                buffer = Buffer.createIndexBuffer({
                    context : context,
                    sizeInBytes : 0,
                    usage : BufferUsage.STATIC_DRAW,
                    indexDatatype : IndexDatatype.UNSIGNED_SHORT
                });
            }).toThrowDeveloperError();
        });

        it('creates index buffer' + webglMessage, function() {
            buffer = Buffer.createIndexBuffer({
                context : context,
                sizeInBytes : 6,
                usage : BufferUsage.STREAM_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });

            expect(buffer.sizeInBytes).toEqual(6);
            expect(buffer.usage).toEqual(BufferUsage.STREAM_DRAW);

            expect(buffer.indexDatatype).toEqual(IndexDatatype.UNSIGNED_SHORT);
            expect(buffer.bytesPerIndex).toEqual(2);
            expect(buffer.numberOfIndices).toEqual(3);
        });

        it('copies array to an index buffer' + webglMessage, function() {
            var sizeInBytes = 3 * Uint16Array.BYTES_PER_ELEMENT;
            var elements = new ArrayBuffer(sizeInBytes);
            var indices = new Uint16Array(elements);
            indices[0] = 1;
            indices[1] = 2;
            indices[2] = 3;

            buffer = Buffer.createIndexBuffer({
                context : context,
                sizeInBytes : sizeInBytes,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });
            buffer.copyFromArrayView(elements);
        });

        it('can create an index buffer from a typed array' + webglMessage, function() {
            var typedArray = new Uint16Array(3);
            typedArray[0] = 1;
            typedArray[1] = 2;
            typedArray[2] = 3;

            buffer = Buffer.createIndexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });
            expect(buffer.sizeInBytes).toEqual(typedArray.byteLength);
            expect(buffer.usage).toEqual(BufferUsage.STATIC_DRAW);
            expect(buffer.indexDatatype).toEqual(IndexDatatype.UNSIGNED_SHORT);
        });

        it('can create an index buffer from a size in bytes' + webglMessage, function() {
            buffer = Buffer.createIndexBuffer({
                context : context,
                sizeInBytes : 6,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });
            expect(buffer.sizeInBytes).toEqual(6);
            expect(buffer.usage).toEqual(BufferUsage.STATIC_DRAW);
            expect(buffer.indexDatatype).toEqual(IndexDatatype.UNSIGNED_SHORT);
        });

        it('getBufferData throws without WebGL 2' + webglMessage, function() {
            if (context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            var array = new Uint8Array(4);

            expect(function() {
                buffer.getBufferData(array);
            }).toThrowDeveloperError();
        });

        it('getBufferData throws without arrayView' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.getBufferData(undefined);
            }).toThrowDeveloperError();
        });

        it('getBufferData throws with invalid sourceOffset' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            var array = new Uint8Array(4);

            expect(function() {
                buffer.getBufferData(array, -1);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.getBufferData(array, 5);
            }).toThrowDeveloperError();
        });

        it('getBufferData throws with invalid destinationOffset' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            var array = new Uint8Array(4);

            expect(function() {
                buffer.getBufferData(array, 0, -1);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.getBufferData(array, 0, 5);
            }).toThrowDeveloperError();
        });

        it('getBufferData throws with invalid length' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            var array = new Uint8Array(4);

            expect(function() {
                buffer.getBufferData(array, 2, 0, 4);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.getBufferData(array, 0, 2, 4);
            }).toThrowDeveloperError();
        });

        it('getBufferData reads from vertex buffer' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            var typedArray = new Uint8Array(4);
            typedArray[0] = 1;
            typedArray[1] = 2;
            typedArray[2] = 3;
            typedArray[3] = 4;

            buffer = Buffer.createVertexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW
            });

            var destArray = new Uint8Array(4);
            buffer.getBufferData(destArray);

            expect(destArray).toEqual(typedArray);
        });

        it('getBufferData reads from index buffer' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }
            var typedArray = new Uint16Array(3);
            typedArray[0] = 1;
            typedArray[1] = 2;
            typedArray[2] = 3;

            buffer = Buffer.createIndexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });

            var destArray = new Uint16Array(3);
            buffer.getBufferData(destArray);

            expect(destArray).toEqual(typedArray);
        });

        it('copyFromBuffer throws without WebGL 2' + webglMessage, function() {
            if (context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 0, 4);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws without readBuffer' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(undefined, 0, 0, 4);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws with invalid readOffset' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(buffer2, undefined, 0, 4);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, -1, 0, 4);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 5, 0, 4);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws with invalid writeOffset' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, undefined, 4);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, -1, 4);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 5, 4);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws with invalid sizeInBytes' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 0, undefined);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 0, -1);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 0, 0);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer2, 0, 0, 5);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws with one index buffer and the other is not an index buffer' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            var typedArray = new Uint16Array([0, 1, 2, 3, 4]);
            buffer = Buffer.createIndexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });
            var typedArray2 = new Float32Array([5.0, 6.0, 7.0, 8.0, 9.0]);
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                typedArray : typedArray2,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer2.copyFromBuffer(buffer, 0, 0, typedArray.byteLength);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer throws when readBuffer is the same buffer and copy range overlaps' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 4,
                usage : BufferUsage.STATIC_DRAW
            });

            expect(function() {
                buffer.copyFromBuffer(buffer, 0, 1, 2);
            }).toThrowDeveloperError();
            expect(function() {
                buffer.copyFromBuffer(buffer, 1, 0, 2);
            }).toThrowDeveloperError();
        });

        it('copyFromBuffer with vertex buffers' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            var typedArray = new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0]);
            buffer = Buffer.createVertexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW
            });
            var typedArray2 = new Float32Array([5.0, 6.0, 7.0, 8.0, 9.0]);
            buffer2 = Buffer.createVertexBuffer({
                context : context,
                typedArray : typedArray2,
                usage : BufferUsage.STATIC_DRAW
            });

            var destArray = new Float32Array(5);
            buffer.getBufferData(destArray);
            expect(destArray).toEqual(typedArray);
            buffer2.getBufferData(destArray);
            expect(destArray).toEqual(typedArray2);

            buffer2.copyFromBuffer(buffer, 0, 0, typedArray.byteLength);
            buffer2.getBufferData(destArray);
            expect(destArray).toEqual(typedArray);
        });

        it('copyFromBuffer with index buffers' + webglMessage, function() {
            if (!context.webgl2) {
                return;
            }

            var typedArray = new Uint16Array([0, 1, 2, 3, 4]);
            buffer = Buffer.createIndexBuffer({
                context : context,
                typedArray : typedArray,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });
            var typedArray2 = new Uint16Array([5, 6, 7, 8, 9]);
            buffer2 = Buffer.createIndexBuffer({
                context : context,
                typedArray : typedArray2,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_SHORT
            });

            var destArray = new Uint16Array(5);
            buffer.getBufferData(destArray);
            expect(destArray).toEqual(typedArray);
            buffer2.getBufferData(destArray);
            expect(destArray).toEqual(typedArray2);

            buffer2.copyFromBuffer(buffer, 0, 0, typedArray.byteLength);
            buffer2.getBufferData(destArray);
            expect(destArray).toEqual(typedArray);
        });

        it('destroys' + webglMessage, function() {
            var b = Buffer.createIndexBuffer({
                context : context,
                sizeInBytes : 3,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_BYTE
            });
            expect(b.isDestroyed()).toEqual(false);
            b.destroy();
            expect(b.isDestroyed()).toEqual(true);
        });

        it('fails to provide an array view' + webglMessage, function() {
            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 3,
                usage : BufferUsage.STATIC_DRAW
            });
            expect(function() {
                buffer.copyFromArrayView();
            }).toThrowDeveloperError();
        });

        it('fails to copy a large array view' + webglMessage, function() {
            buffer = Buffer.createVertexBuffer({
                context : context,
                sizeInBytes : 3,
                usage : BufferUsage.STATIC_DRAW
            });
            var elements = new ArrayBuffer(3);

            expect(function() {
                buffer.copyFromArrayView(elements, 1);
            }).toThrowDeveloperError();
        });

        it('fails to destroy' + webglMessage, function() {
            var b = Buffer.createIndexBuffer({
                context : context,
                sizeInBytes : 3,
                usage : BufferUsage.STATIC_DRAW,
                indexDatatype : IndexDatatype.UNSIGNED_BYTE
            });
            b.destroy();

            expect(function() {
                b.destroy();
            }).toThrowDeveloperError();
        });
    }
}, 'WebGL');
